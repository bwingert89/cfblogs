# viewership

*Who draws a TV audience*: a model of college football television audiences, 2013-2025.

| file | what it is |
|---|---|
| `post.md` | the post as pasted into Bear |
| `figures/measured-share-v<N>.png` | share of regular-season FBS games with a published audience, by matchup type |
| `figures/slot-multipliers-v<N>.png` | what network, kickoff, rankings, stakes and matchup do to an audience |
| `figures/draw-ladder-v<N>.png` | the 25 programs that bring the most audience, with standard errors |
| `figures/brand-vs-strength-v<N>.png` | each program's draw against its average Elo rating |
| `figures/audience-movers-v<N>.png` | the largest changes in draw between 2015-2019 and 2021-2025 |

## How the figures were made

Data: Sports Media Watch's weekly college football TV ratings tables, 2013-2025 (2013-2020 parsed from
HTML, 2021-2025 transcribed by hand from the weekly images), each telecast matched to a CollegeFootballData
game, with that week's poll rankings, the final score and the season's Elo ratings.

Model: log viewers regressed on both teams' draws (penalised toward zero, penalty chosen by
leave-one-season-out on 2015-2019) plus network, kickoff window, each side's ranking, stakes, conference
game, neutral site, FCS opponent, competing measured telecasts, and season effects. Fit on 4,614 telecasts,
2020 excluded.

Code: the private project's `cfbgraph.ingest.viewership` and `cfbgraph.viewership` packages and
`notebooks/viewership_model.ipynb`; the figures are drawn by `scripts/scratch/blog_viewership/figures.py`
there and published with `posts/_shared/blogfig.py`.
