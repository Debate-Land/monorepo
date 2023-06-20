import { prisma, JudgeTournamentResult } from "@shared/database";
import restHandler, { PrismaModel } from "../../../utils/rest-handler";
import { Handlers } from "@shared/email";

export default restHandler<JudgeTournamentResult>(
  prisma.judgeTournamentResult as PrismaModel<JudgeTournamentResult>,
  // [auth, rateLimiter, usage]
  [
    (req, res, next) => {
      if (req.method === 'POST') {
        res.on("finish", () => {
          const { judge } = req.body;
          if (judge) {
            Handlers.Judge(judge.connect.id);
          }
        });
      }
      next();
    }
  ]
);