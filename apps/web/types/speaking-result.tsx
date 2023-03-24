import { ref } from "./common";
import Competitor from "./competitor";

interface SpeakingResult {
  _id: string;
  competitor: ref<Competitor>;
  raw_avg: number;
  adj_avg: number;
}

export default SpeakingResult;
