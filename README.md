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
| `<post>/<name>.js` | a post's interactive piece, loaded only on a page with an element carrying `data-cfblogs="<post>/<name>.js?v=N"` |
| `shared/bear-footer.html` | the one script for Bear's footer directive: it loads each page's interactive pieces from this site and does nothing elsewhere |
| `index.html` | the list of posts, so the site root is not a 404 |
| `.nojekyll` | serve every file as-is (Jekyll would hide paths that start with `_`) |

## Conventions

- **Versions are never reused.** A corrected figure is published as the next `-vN` and `post.md`
  is relinked. Browsers and Bear's previews cache images by URL, so overwriting a file in place
  can keep showing the old chart.
- **Figures are outputs.** They are drawn by a private analysis project (`cfbgraph26`) through
  `posts/_shared/blogfig.py`, which saves, stamps, versions and relinks each one. Unstamped copies
  (`figures_clean/`) stay local and are gitignored.
- **Interactive pieces version their URL too** (`?v=N` in the `data-cfblogs` attribute), and the script
  passes the same version to the data it fetches.
- **One post, one folder**, named for the post's subject in lowercase with hyphens.

## Posts

| folder | post |
|---|---|
| [`viewership/`](viewership/) | Who draws a TV audience: a model of college football viewership, 2013-2025 |

Earlier posts kept their figures elsewhere: *A Designed Non-Conference Schedule* lives in
https://github.com/bwingert89/cfbschedules.
