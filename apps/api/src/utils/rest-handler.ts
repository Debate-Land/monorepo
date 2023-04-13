import { json, RequestHandler } from "express";
import { NextFunction, Router } from "express";
import type { Request } from "express";
import status from "http-status";
import { isArray, isInteger } from "lodash";
import omit from "lodash/omit";
import Cacheable from "./cacheable";
import { getHash } from "./hash";

interface BatchPayload {
  count: number;
}

export interface PrismaObject extends Object {
  id: string | number
}

export interface PrismaQuery<T> {
  where?: {
    [k in keyof T]: T[k] | Object
  },
  create?: {
    [k in keyof T]: T[k]
  },
  expand?: {
    [k in keyof T]: Boolean | Object
  },
  select?: {
    [k in keyof T]: Boolean | Object
  },
  data?: { [k in keyof T]: T[k] } | T[],
  skip?: number,
  take?: number,
  cursor?: {
    id: number
  },
  orderBy?: {
    [k in keyof T]: String
  },
  skipDuplicates?: Boolean
}

export interface PrismaModel<T> {
  create(q: PrismaQuery<T>): Promise<T>,
  createMany(q: PrismaQuery<T>): Promise<BatchPayload>,
  findUnique(q: PrismaQuery<T>): Promise<T | null>,
  findFirst(q: PrismaQuery<T>): Promise<T | null>,
  findMany(q: PrismaQuery<T>): Promise<T[] | null>,
  update(q: PrismaQuery<T>): Promise<T | null>,
  updateMany(q: PrismaQuery<T>): Promise<BatchPayload>,
  upsert(q: PrismaQuery<T>): Promise<T>,
  delete(q: PrismaQuery<T>): Promise<T>,
  deleteMany(q: PrismaQuery<T>): Promise<BatchPayload>,
}

interface IRestHandler {
  create: RequestHandler;
  retrieve: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
  list: RequestHandler;
  advanced: RequestHandler;
};

const getRestHandlers = <T extends PrismaObject>(
  model: PrismaModel<T>,
  getOmitProperties: (req: Request) => Promise<(keyof T)[]> = async () => [],
): IRestHandler => ({
  create: async (req, res, next) => {
    try {
      const omitProperties = await getOmitProperties(req);
      const data = isArray(req.body)
        ? req.body.map((obj: T) => omit<T>(obj, omitProperties)) as T[]
        : omit<T>(req.body, omitProperties) as T;
      const result = isArray(data)
        ? await model.createMany({ data })
        : await model.create({ data });

      res.send(result);
    }
    catch (e: any) {
      res.status(status.NOT_FOUND).send(e.message);
      next(e);
    }
  },
  retrieve: async (req, res, next) => {
    try {
      const { id } = req.params;
      const skipCache = req.headers['cache-control'] === 'no-cache';
      let { select: _select, expand: _expand, where: _where } = req.query;
      const omitProperties = await getOmitProperties(req);

      let select: { [k in keyof T]?: Boolean } = {};
      (_select as String)?.split(",").forEach(s => select[s as keyof T] = true);

      let expand: { [k in keyof T]?: Boolean } = {};
      (_expand as String)?.split(",").forEach(s => expand[s as keyof T] = true);

      let where: { [k in keyof T]?: T[k] } = JSON.parse(`{${_where || ''}}`);
      if (id) where.id = Number(id) || id;

      let result: T | T[] | null;
      let query: PrismaQuery<T> = {
        where,
        ...(_select && { select }),
        ...(_expand && { include: expand })
      } as PrismaQuery<T>;

      result = await new Cacheable<T | null>(
        async () => await model.findUnique(query),
        `retrieve:${getHash(JSON.stringify(query))}`,
        skipCache
      ).get();

      result
        ? res.send(omit<T>(result, omitProperties))
        : res.status(status.NOT_FOUND).send(result);
    }
    catch (e: any) {
      res.status(status.NOT_FOUND).send({
        error: e.message,
      });
      next(e);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { where: _where, upsert = false } = req.query;
      const omitProperties = await getOmitProperties(req);

      let where: { [k in keyof T]?: T[k] } = JSON.parse(`{${_where || ''}}`);
      if (id) where.id = Number(id) || id;

      let result: T | BatchPayload | null;
      let query: PrismaQuery<T> = {
        where,
        data: omit<T>(req.body, omitProperties)
      } as PrismaQuery<T>;

      if (upsert) {
        result = await model.upsert(query.data as PrismaQuery<T>);
      }
      else {
        result = id
          ? await model.update(query)
          : await model.updateMany(query);
      }

      result
        ? res.send(
          id
            ? omit<T>(result as T, omitProperties)
            : result
        )
        : res.status(status.NOT_FOUND).send(result);
    }
    catch (e: any) {
      res.status(status.NOT_FOUND).send({
        error: e.message,
      });
      next(e)
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { select: _select, expand: _expand, where: _where } = req.query;
      const omitProperties = await getOmitProperties(req);

      let select: { [k in keyof T]?: Boolean } = {};
      (_select as String)?.split(",").forEach(s => select[s as keyof T] = true);

      let expand: { [k in keyof T]?: Boolean } = {};
      (_expand as String)?.split(",").forEach(s => expand[s as keyof T] = true);

      let where: { [k in keyof T]?: T[k] } = JSON.parse(`{${_where || ''}}`);
      if (id) where.id = Number(id) || id;

      let result: T | BatchPayload | null;
      let query: PrismaQuery<T> = {
        where,
        ...(_select && { select }),
        ...(_expand && { include: expand }),
      } as PrismaQuery<T>;

      result = id
        ? await model.delete(query)
        : await model.deleteMany(query);

      result
        ? res.send(
          id
            ? omit<T>(result as T, omitProperties)
            : result
        )
        : res.status(status.NOT_FOUND).send(result);
    }
    catch (e: any) {
      res.status(status.NOT_FOUND).send({
        error: e.message,
      });
      next(e);
    }
  },
  list: async (req, res, next) => {
    try {
      const skipCache = req.headers['cache-control'] === 'no-cache';
      const { select: _select, expand: _expand, where: _where, order: _order, cursor: _cursor, page, limit, ...search } = req.query;
      const omitProperties = await getOmitProperties(req);

      let select: { [k in keyof T]?: Boolean } = {};
      (_select as String)?.split(",").forEach(s => select[s as keyof T] = true);

      let expand: { [k in keyof T]?: Boolean } = {};
      (_expand as String)?.split(",").forEach(s => expand[s as keyof T] = true);

      let where: { [k in keyof T]?: T[k] | { search: string } } = JSON.parse(`{${_where || ''}}`);
      for (const [key, value] of Object.entries(search)) {
        where[key as keyof T] = { search: value as string };
      }

      let order: { [k in keyof T]?: String } = {};
      (_order as String)?.split(",").forEach(s => {
        let [key, value] = s.split(":");
        order[key as keyof T] = value;
      });

      let cursor: { [k in keyof T]?: T[k] } = JSON.parse(`{${_cursor || ''}}`);

      let result: T | T[] | null;
      let query: PrismaQuery<T> = {
        ...((_where || search) && { where }),
        ...(_select && { select }),
        ...(_expand && { include: expand }),
        ...(_order && { orderBy: order }),
        ...(_cursor && { cursor }),
        ...(page && isInteger(parseInt(page as string)) && { skip: parseInt(page as string) }),
        ...(limit && isInteger(parseInt(limit as string)) && { take: parseInt(limit as string) })
      } as PrismaQuery<T>;

      result = await new Cacheable<T[] | null>(
        async () => await model.findMany(query),
        `list:${getHash(JSON.stringify(query))}`,
        skipCache
      ).get();

      if (isArray(result)) {
        result = result.map(result => omit<T>(result, omitProperties) as T);
      }

      result
        ? res.send(result)
        : res.status(status.NOT_FOUND).send(result);
    }
    catch (e: any) {
      res.status(status.NOT_FOUND).send({
        error: e.message,
      });
      next(e);
    }
  },
  advanced: async (req, res, next) => {
    try {
      const skipCache = req.headers['cache-control'] === 'no-cache';
      const { action } = req.params;

      const result = await new Cacheable<T[] | null>(
        async () => await model[action as keyof PrismaModel<T>](req.body || {}),
        `list:${getHash(JSON.stringify(req.body))}`,
        skipCache
      ).get();

      result
        ? res.send(result)
        : res.status(status.NOT_FOUND).send(result);
    }
    catch (e: any) {
      res.status(status.NOT_FOUND).send({
        error: e.message,
      });
      next(e);
    }
  }
});

// eslint-disable-next-line import/no-anonymous-default-export
export default function <T extends PrismaObject>(
  model: PrismaModel<T>,
  middleware: NextFunction[] = [],
  getOmitProperties: (req: Request) => Promise<(keyof T)[]> = async () => [],
): Router {
  const router = Router();
  router.use(json());
  middleware.length && router.use(...middleware);

  const handlers = getRestHandlers<T>(model, getOmitProperties);

  router.post('/:id', handlers.create)
  router.post('/', handlers.create);

  router.get('/:id', handlers.retrieve);
  router.get('/', handlers.list);

  router.patch('/:id', handlers.update);
  router.patch('/', handlers.update);

  router.delete('/:id', handlers.delete);
  router.delete('/', handlers.delete);

  router.post('/advanced/:action', handlers.advanced)

  return router;
}
