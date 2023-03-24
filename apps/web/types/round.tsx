import { ref, Result, Side } from "./common";
import Competitor from "./competitor";
import Entry from "./entry";
import JudgeRecord from "./judge-record";
import SpeakingResult from "./speaking-result";

interface Round {
  _id: string;
  name: string;
  name_std: string;
  result: Result;
  decision: [number, number];
  judges: ref<JudgeRecord>[];
  side: Side;
  opponent: ref<Entry>;
  op_wp: number;
  speaking_results: SpeakingResult[];
}

export default Round
