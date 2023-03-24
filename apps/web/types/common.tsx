type ref<t> = string | t;

type TabroomAsset = string;

type ElimRoundName =
  "Finals" |
  "Semifinals" |
  "Quarterfinals" |
  "Octafinals" |
  "Double Octafinals" |
  "Triple Octafinals" |
  "Quadruple Octafinals"

type Bid =
  "full" |
  "partial"

type Event =
  "Public Forum" |
  "Lincoln Douglas" |
  "Policy"

type RoundType =
  "prelim" |
  "elim"

type Side =
  "Pro" |
  "Con" |
  "Aff" |
  "Neg"

type Result =
  "Win" |
  "Loss" |
  "Bye"

export type {
  TabroomAsset,
  ElimRoundName,
  Bid,
  Event,
  RoundType,
  Side,
  Result,
  ref
}
