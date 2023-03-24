import type { ref, Bid, TabroomAsset } from './common'
import School from './school'
import Tournament from './tournament'
import Competitor from './competitor'
import SpeakingResult from './speaking-result'
import Round from './round'

interface TournamentResult {
  _id: string
  tournament: ref<Tournament>
  code: string
  competitors: ref<Competitor>[]
  prelim_rank: [number, number]
  prelim_record: [number, number]
  elim_record: [number, number]
  entry_id: number
  entry_page: TabroomAsset
  school: School
  speaking_results: ref<SpeakingResult>[]
  bid: Bid | null
  is_ghost_bid: boolean
  op_wpm: number
  prelim_rounds: ref<Round>[]
  elim_rounds: ref<Round>[]
}

export default TournamentResult
