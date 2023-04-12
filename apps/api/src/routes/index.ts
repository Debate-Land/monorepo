import { Router } from "express";
import coreV1Router from "./v1";

export const coreRouter = Router();

coreRouter.use('/v1', coreV1Router);
