const curlResponse: any = [];
`
  "results": [
    {
      "_id": "62ba227456faa2ab1c9b8088",
      "codes": [
        "Bethesda Chevy Chase GT"
      ],
      "tournaments": [
        {
          "tournament": {
            "name": "2021 Sunvite",
            "date": "1970-01-20T04:05:35.166Z",
            "url": "https://tabroom.com",
            "has_elim_rounds": true,
            "toc_qualifier": true,
            "boost": 2
          },
          "competitors": [
            {
              "first_name": "Eli",
              "last_name": "Glickman",
              "raw_average": 29.43,
              "adj_average": 29.43,
              "_id": "62ba227456faa2ab1c9b808a"
            },
            {
              "first_name": "Roy",
              "last_name": "Tiefer",
              "raw_average": 29.52,
              "adj_average": 29.52,
              "_id": "62ba227456faa2ab1c9b808b"
            }
          ],
          "prelim_record": [
            6,
            0
          ],
          "elim_record": [
            1,
            1
          ],
          "bid": "silver",
          "op_wpm": 3.667,
          "eliminated": {
            "type": "elims",
            "data": {
              "decision": [
                1,
                2
              ],
              "round_raw": "Double Octofinals",
              "round_std": "Double Octafinals",
              "team": "Montville BL",
              "_id": "62ba227456faa2ab1c9b808d"
            },
            "_id": "62ba227456faa2ab1c9b808c"
          },
          "_id": "62ba227456faa2ab1c9b8089",
          "wpm": 1,
          "elim_boost": 3,
          "otr_comp": 6
        },
`
  .split('\n')
  .forEach(line => curlResponse.push({ text: line, cmd: false }));

export default [
  {
    text: "curl -I -H \"Authorization: Bearer sk_69142011738\" \\",
    cmd: true,
  },
  {
    text: "\"https://api.debate.land/entries/public_forum/national/2021?page=0&limit=1\"",
    cmd: false
  },
  {
    text: '',
    cmd: false,
  },
  ...curlResponse
];