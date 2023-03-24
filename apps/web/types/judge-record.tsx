import { ref, RoundType, Side, TabroomAsset } from "./common";
import Circuit from "./circuit";
import Judge from "./judge";
import Round from "./round";
import Tournament from "./tournament";

interface JudgeRecord {
  _id: string;
  decision: Side;
  avg_speaker_points: number;
  round: ref<Round>;
  judge_url: TabroomAsset;
  judge: ref<Judge>;
  type: RoundType;
  event: Event;
  circuit: Circuit;
  tournament: ref<Tournament>;
  timestamp: number;
}

export default JudgeRecord
