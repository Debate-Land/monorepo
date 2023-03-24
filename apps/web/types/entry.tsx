import Circuit from "./circuit";
import { ref } from "./common";
import Competitor from "./competitor";
import School from "./school";
import Statistics from "./statistics";
import TournamentResult from "./tournament-result";

interface Entry {
  // Metadata
  _id: string;
  codes: string[];
  competitors: ref<Competitor>[];
  schools: School[];
  statistics?: Statistics; // Computed, Expandable

  // Can be used as filter options
  event: Event;
  circuits: Circuit[];
  seasons: number[];

  // Results
  tournaments: ref<TournamentResult>[];
}

export default Entry
