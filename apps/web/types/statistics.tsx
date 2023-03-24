import { ref } from "./common";
import Competitor from "./competitor";
import SpeakingResult from "./speaking-result";

interface Statistics {
  _id: string;
  prelim_record: [number, number];
  elim_record: [number, number];
  break_pct: number;
  avg_op_wpm: number;
  otr_score: number;
  rank: {
    circuit: {
      season: number;
      all_time: number;
    },
    event: {
      season: number;
      all_time: number;
    }
  };
  speaking_results: ref<SpeakingResult>[];
  bids: {
    full: number;
    partial: number;
    ghost_full: number;
    ghost_partial: number;
  }
}

export default Statistics
