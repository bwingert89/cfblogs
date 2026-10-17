# cfblogs

Figures and supporting files for the posts on Big Trouble Blog, one subdirectory per post.
Served by GitHub Pages at https://bwingert89.github.io/cfblogs/, so a post links its figures as

    https://bwingert89.github.io/cfblogs/<post>/figures/<name>-v<N>.png

## Layout

| path | what it is |
|---|---|
| `<post>/post.md` | the post's text as pasted into Bear, with every figure linked from this site |
| `<post>/figures/<name>-v<N>.png` | the published figures, credit-stamped and versioned |
| `<post>/README.md` | what the post covers and how its figures were made |
| `index.html` | the list of posts, so the site root is not a 404 |
| `.nojekyll` | serve every file as-is (Jekyll would hide paths that start with `_`) |

## Conventions

- **Versions are never reused.** A corrected figure is published as the next `-vN` and `post.md`
  is relinked. Browsers and Bear's previews cache images by URL, so overwriting a file in place
  can keep showing the old chart.
- **Figures are outputs.** They are drawn by a private analysis project (`cfbgraph26`) through
  `posts/_shared/blogfig.py`, which saves, stamps, versions and relinks each one. Unstamped copies
  (`figures_clean/`) stay local and are gitignored.
- **One post, one folder**, named for the post's subject in lowercase with hyphens.

## Posts

| folder | post |
|---|---|
| [`viewership/`](viewership/) | Who draws a TV audience: a model of college football viewership, 2013-2025 |

Earlier posts kept their figures elsewhere: *A Designed Non-Conference Schedule* lives in
https://github.com/bwingert89/cfbschedules.
