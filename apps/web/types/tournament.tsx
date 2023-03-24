import Circuit from './circuit';
import type { TabroomAsset, Event, ElimRoundName } from './common';

interface Tournament {
  _id: string;
  name: string;
  start_date: number;
  end_date: number;
  location: string;
  url: TabroomAsset;
  event: Event;
  event_url: TabroomAsset;
  prelim_url: TabroomAsset;
  tourn_id: string;
  circuit: Circuit;
  season: number;
  is_toc_qualifier: boolean;
  bid_level: ElimRoundName;
}

export default Tournament;
