import { prisma, TeamTournamentResult } from "@shared/database";
import restHandler, { PrismaModel } from "../../../utils/rest-handler";
import { Handlers } from "@shared/email";

export default restHandler<TeamTournamentResult>(
  prisma.teamTournamentResult as PrismaModel<TeamTournamentResult>,
  // [auth, rateLimiter, usage]
  [
    (req, res, next) => {
      if (req.method === 'POST') {
        res.on("finish", () => {
          const { team } = req.body;
          if (team) {
            Handlers.Team(team.connect.id);
          }
        });
      }
      next();
    }
  ]
);
