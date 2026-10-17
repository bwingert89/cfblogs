Alabama, Michigan and Ohio State each bring more than twice the television audience of an average program to the same time slot against the same opponent. Nebraska, with one winning season between 2017 and 2023, brings almost as much. Clemson, which won two national titles in the same stretch, brings less than Iowa.

Those are the results of a model fit to every college football telecast with a published audience from 2013 to 2025: 4,898 games, from Sports Media Watch's weekly ratings tables, each matched to the game it aired.

**The short version:**

- **2.3×** the audience of an average program: Alabama, Michigan and Ohio State, once network, kickoff time, rankings and stakes are held equal.
- **1.5×** an ESPN audience for the same game on ABC. ESPNU gets about a fifth.
- **0.78** is the correlation between a program's draw and how good it has been. The rest is brand.
- **+75%** for Kansas between 2015–2019 and 2021–2025, and **+73%** for Colorado. Army and Memphis fell by more than a fifth.
- **4%** of the audience is lost to a two-touchdown blowout. The matchup sets the audience before kickoff, and the game itself barely moves it.

## 1. Where the numbers come from

Sports Media Watch has published a table of college football television audiences every week since 2013: the game, the network, the kickoff time and the Nielsen viewer count. Through 2020 those are HTML tables. From 2021 they are images, which were transcribed by hand. Every row was matched to the game it describes in CollegeFootballData's schedule, which adds the teams' rankings in the poll that was current that week, the final score, and whether the game was a bowl, a playoff game or a neutral-site game.

The data covers the top of the slate, not all of it. A telecast only gets a published number if Nielsen measures it, and conference networks and streaming-only games mostly are not measured.

![measured-share-v1](https://bwingert89.github.io/cfblogs/viewership/figures/measured-share-v1.png)

*About two thirds of power-conference games against each other have a published audience in a typical season, under half of power-versus-Group of Five games, and a quarter or less of games between two Group of Five teams. 2020 is left out of everything that follows: its windows, crowds and schedules were not a normal season.*

That matters for reading the results. A Group of Five program's draw here describes how it did in the games the networks chose to put on a measured channel. It says nothing about how often that happened.

## 2. Separating the team from the time slot

Raw audiences mostly measure the slot. The median measured game drew 1.3 million viewers. The 2014 national championship drew 34 million. A Saturday-night ABC game and a Thursday ESPNU game differ by more than any two teams do, and the best teams get the best slots, so a raw average flatters them twice.

The model takes that apart. Each telecast's audience, on a log scale, is the sum of:

- the **draw** of each of the two teams, which is what this post is about;
- the **network** and the **kickoff window**;
- each team's **ranking** in the poll that was current that week;
- the **stakes**: regular season, bowl, New Year's Six bowl or playoff;
- the **matchup**: conference game, neutral site, or an FCS opponent;
- **competition**, counted as the number of other measured games airing at the same time;
- a **season** term, which absorbs year-to-year changes in how audiences are counted.

The team draws are shrunk toward average, so a program with a handful of telecasts cannot end up at the top on two lucky games. How hard to shrink was chosen by fitting on four of the five seasons from 2015 to 2019 and predicting the fifth, in turn.

It works on seasons it never saw. Fit on 2015–2019 and asked to predict 2013 and 2014, the model's typical miss is a factor of about 1.6 in audience, against 1.8 without the team draws and 3.7 for the raw spread. Most of what makes an audience is the slot. The teams account for about a fifth of what is left over.

![slot-multipliers-v1](https://bwingert89.github.io/cfblogs/viewership/figures/slot-multipliers-v1.png)

*Each dot is what one feature of a telecast does to its audience with everything else held equal. The model is fit on all 4,614 telecasts from 2013 to 2025 except 2020.*

The network matters most. The same game draws half again as much on ABC or CBS as on ESPN, and a fifth as much on ESPNU. A top-five team adds about 60% to the audience, on either side of the matchup. A playoff game draws two and a half times a regular-season game in the same slot. Kickoff time matters less than its reputation once the network is accounted for: Saturday prime time is worth about 9% over the afternoon, because the prime-time premium mostly reflects which network gets the window. Weeknight games do better than either, at 18%, even after their lack of competing games is accounted for.

A conference game draws 10% less than a non-conference game between the same teams in the same slot. A neutral site adds 23%, which mostly marks the made-for-television kickoff games and the neutral-site rivalries such as Texas–Oklahoma and Georgia–Florida. Each other measured game airing at the same time takes about 3%.

## 3. Who brings the audience

![draw-ladder-v1](https://bwingert89.github.io/cfblogs/viewership/figures/draw-ladder-v1.png)

*Each program's draw: the audience it brings against an average program, in the same slot against the same opponent. Programs with fewer than 20 measured telecasts are left off the chart, since their estimates are too uncertain to rank.*

The top of the list is the list everyone would guess, with one exception. Alabama, Michigan and Ohio State are effectively tied at 2.3× an average program. **Nebraska is fourth**, at 2.2×, ahead of Texas, Georgia and LSU, over a period in which it never won more than nine games in a season. **Notre Dame**, with more measured telecasts than any other program (143), is 13th at 1.8×. **Clemson** is 24th at 1.5×, behind Iowa, Arkansas and South Carolina.

At the other end, among programs measured at least 30 times, Rice (0.57×), North Texas (0.60×) and Troy (0.65×) bring the least.

**Iowa State** brings 1.26×, 48th of the 124 programs measured 20 or more times. That is a quarter more audience than an average program, and a little below where its results would predict.

## 4. Strength explains most of it, not all

The obvious explanation for a draw is winning. To test it, each program's draw is compared with how good it has been, measured by its average Elo rating over the same seasons.

![brand-vs-strength-v1](https://bwingert89.github.io/cfblogs/viewership/figures/brand-vs-strength-v1.png)

*Each program's audience draw against its average Elo rating, 2013–2025, for the 124 programs measured 20 or more times. The dashed line is the best straight-line fit. A program above the line draws more than its results predict.*

The correlation is 0.78, so winning is most of it. One standard deviation of Elo is worth about 50% more audience. The interesting programs are the ones off the line.

**Above it**, drawing more than their results predict:

- **Colorado**, by the widest margin. Its average Elo over the period is below average, and its draw is 1.75×. That draw leans on 2023–2025, when Colorado was measured 32 times in three seasons against 41 in the eight before.
- **Nebraska**, the purest case of brand. Its record is roughly average, and its audience is a top-four program's.
- **Rutgers, Kansas and Purdue**, which lost far more than they won over the period and still drew Big Ten- and Big 12-sized audiences.
- **Michigan State, Illinois and Oregon State.**

**Below it**, drawing less than their results predict:

- **Florida International** sits furthest below, at a quarter of an average audience.
- **Florida Atlantic, James Madison, Western Kentucky and Toledo** are good Group of Five programs whose audience did not follow their results.
- **Clemson** is the one elite program well below the line. Its Elo is 1.7 standard deviations above average, close to Georgia's 1.8, and its audience is that of a program most of a standard deviation weaker.

## 5. Who gained an audience, and who lost one

Brands move slowly, but they move. Fitting the same model separately on 2015–2019 and on 2021–2025 gives each program two draws.

![audience-movers-v1](https://bwingert89.github.io/cfblogs/viewership/figures/audience-movers-v1.png)

*The largest changes in draw between 2015–2019 (circle) and 2021–2025 (logo), among the 104 programs measured at least ten times in both periods.*

Most programs barely move: across all 104, the two periods correlate at 0.88. The exceptions have stories behind them.

- **Colorado** went from 1.2× to 2.1×, fifth in the country in 2021–2025. That is Deion Sanders.
- **Kansas** went from 0.81× to 1.4×, the largest rise of any program, on the back of a 2022 bowl team and a nine-win 2023.
- **Iowa State** went from 1.05× to 1.37×, 34th in the recent period.
- **BYU** went from 0.98× to 1.24× as it moved into the Big 12.
- **Army** fell from 1.5× to 1.15×. Its 2015–2019 draw rested on 16 telecasts, five of them Army–Navy and four against Notre Dame, Ohio State, Michigan and Penn State.
- **Memphis** fell from 1.05× to 0.81×. **Troy, New Mexico, Temple and Marshall** fell further.

Notre Dame slipped from 1.81× to 1.53× between the periods, from 13th to 19th, with a playoff appearance in each.

## 6. Does the game itself matter?

Only a little. The audience figure is the average over the whole broadcast, so a blowout should lose its second half. Adding the game's final margin and how it unfolded (from the play-by-play, 2015–2019) to the model:

- a **two-touchdown final margin** costs about 4% of the audience against a one-score game;
- a game **decided by halftime** costs about 4% against one decided at the end;
- a game that **stays within one score through the second half** gains about 7%.

Those are real and in the expected direction, and they are small next to anything in section 2. By the time the game starts, its audience is mostly set by who is playing, where it airs, and what is at stake.

## What this does not show

- **It is a model of the games that were measured.** Most streaming-only and conference-network games have no published audience, so a program's draw comes from its biggest games. That flatters programs that are rarely on national television and land a big window when they are.
- **A draw is an average over thirteen seasons.** Colorado's reflects three seasons of Deion Sanders and ten without him. The period comparison in section 5 is the better read on where a program stands now.
- **The 2021–2025 audiences were transcribed by hand** from Sports Media Watch's weekly images, and the published figures are rounded. Errors in transcription are possible; every row was matched to a real game on the right date, which catches most of them.
- **Audience counts changed over the period.** Nielsen expanded out-of-home viewing in 2020 and moved to a big-data panel in 2025. The season term absorbs a uniform shift but not one that affected some networks more than others.

*Data: Sports Media Watch weekly college football TV ratings, 2013–2025; CollegeFootballData schedules, rankings, scores and Elo ratings. The model is a penalised fixed-effects regression of log viewers on both teams' draws plus network, kickoff window, rankings, stakes, matchup and competing telecasts, with season effects.*
