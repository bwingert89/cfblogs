/* Coach-timeline picker for the viewership post.
 *
 * Mounts into #cfb-viewership-timeline. Reads coach-timeline.json from the folder this script was loaded from:
 * every program's audience by season against its own long-run draw (the season deviations of
 * cfbgraph26's notebooks/viewership_dynamics.ipynb), and its head coaches. A dropdown picks the program; the
 * chart is SVG drawn at the container's real width, so the labels stay legible on a phone, and redrawn on resize.
 */
(function () {
  "use strict";

  // ---- pure layout, checkable without a page -------------------------------------------------------------
  // Line segments break at a skipped season (2020) or a season with no measured telecast.
  function segments(team, data) {
    var bySeason = {}, out = [], run = [];
    team.seasons.forEach(function (s) { bySeason[s[0]] = s; });
    for (var y = data.first; y <= data.last; y++) {
      var s = bySeason[y];
      if (!s || data.skip.indexOf(y) >= 0) { if (run.length) out.push(run); run = []; continue; }
      run.push(s);
    }
    if (run.length) out.push(run);
    return out;
  }

  // Tenure bands clipped to the chart's seasons, in order.
  function bands(team, data) {
    return team.coaches
      .map(function (c) { return { coach: c[0], first: Math.max(c[1], data.first), last: Math.min(c[2], data.last) }; })
      .filter(function (b) { return b.last >= b.first; })
      .sort(function (a, b) { return a.first - b.first; });
  }

  function pct(v) { var r = Math.round(v * 100); return (r > 0 ? "+" : r < 0 ? "−" : "") + Math.abs(r) + "%"; }

  if (typeof document === "undefined") {           // no page: expose the layout for the checks
    var root = typeof globalThis !== "undefined" ? globalThis : this;
    root.cfbTimeline = { segments: segments, bands: bands, pct: pct };
    return;
  }

  var mount = document.getElementById("cfb-viewership-timeline");
  if (!mount || mount.getAttribute("data-ready")) return;
  mount.setAttribute("data-ready", "1");

  var script = document.currentScript || (function () {
    var all = document.getElementsByTagName("script");
    for (var i = all.length - 1; i >= 0; i--) if (/coach-timeline\.js/.test(all[i].src)) return all[i];
    return null;
  })();
  var src = script ? script.src : "";
  var base = src.replace(/coach-timeline\.js.*$/, "");
  var version = (src.match(/[?&]v=([^&]+)/) || [])[1] || "";

  var CSS = [
    ".cfbtl{margin:1.6rem 0 2rem;padding:1.1rem 1.1rem 1rem;border:1px solid rgba(127,115,95,.35);border-radius:8px;font-size:.95rem;line-height:1.4}",
    ".cfbtl *{box-sizing:border-box}",
    ".cfbtl label{display:block;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;opacity:.7;margin-bottom:.25rem}",
    ".cfbtl-pick{display:flex;align-items:center;gap:.55rem;max-width:26rem}",
    ".cfbtl-pick select{flex:1 1 auto;font:inherit;font-size:.9rem;min-width:0;padding:.35rem .4rem;border:1px solid rgba(127,115,95,.45);border-radius:5px;background:transparent;color:inherit}",
    ".cfbtl select option{color:#241E16;background:#FBF7F0}",
    ".cfbtl-logo{flex:0 0 auto;width:36px;height:36px;object-fit:contain}",
    ".cfbtl-head{margin:.9rem 0 .2rem;font-weight:600}",
    ".cfbtl-chart{width:100%}",
    ".cfbtl-chart svg{display:block;overflow:visible}",
    ".cfbtl text{fill:currentColor;font-family:inherit}",
    ".cfbtl .band0{fill:rgba(127,115,95,.10)}.cfbtl .band1{fill:rgba(127,115,95,.22)}",
    ".cfbtl .grid{stroke:rgba(127,115,95,.25);stroke-width:1}.cfbtl .zero{stroke:rgba(127,115,95,.75);stroke-width:1.2}",
    ".cfbtl .line{fill:none;stroke:#3F5E7A;stroke-width:2.2;stroke-linejoin:round}",
    ".cfbtl .pt{fill:#3F5E7A;stroke:#FBF7F0;stroke-width:1.2}.cfbtl .pt.thin{fill:#FBF7F0;stroke:#3F5E7A;stroke-width:1.6;opacity:.75}",
    ".cfbtl .coach{font-size:11px;opacity:.75}.cfbtl .tick{font-size:11px;opacity:.75}",
    "@media (prefers-color-scheme:dark){.cfbtl .line{stroke:#8FB0CF}.cfbtl .pt{fill:#8FB0CF;stroke:#1d1d1d}.cfbtl .pt.thin{fill:#1d1d1d;stroke:#8FB0CF}}",
    ".cfbtl-note{margin-top:.5rem;font-size:.8rem;opacity:.65}"
  ].join("\n");

  var esc = function (t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };

  function draw(team, data, width) {
    var height = Math.round(Math.max(230, Math.min(330, width * 0.46)));
    var m = { l: 46, r: 10, t: 10, b: 26 };
    var n = data.last - data.first + 1;
    var slot = (width - m.l - m.r) / n;
    var x = function (season) { return m.l + (season - data.first + 0.5) * slot; };
    var y0 = data.y[0], y1 = data.y[1];
    var y = function (v) { return m.t + (y1 - Math.max(y0, Math.min(y1, v))) / (y1 - y0) * (height - m.t - m.b); };
    var svg = '<svg width="' + width + '" height="' + height + '" role="img" aria-label="' + esc(team.name) +
      ' audience by season against its long-run draw, with head coaches">';

    bands(team, data).forEach(function (b, i) {
      var left = m.l + (b.first - data.first) * slot, w = (b.last - b.first + 1) * slot;
      var years = b.first === b.last ? b.first : b.first + "–" + b.last;
      svg += '<rect class="band' + (i % 2) + '" x="' + left.toFixed(1) + '" y="' + m.t + '" width="' + w.toFixed(1) + '" height="' +
        (height - m.t - m.b) + '"><title>' + esc(b.coach + ", " + years) + "</title></rect>";
      var surname = b.coach.split(" ").slice(-1)[0].replace(/^(Jr\.|Sr\.|II|III|IV)$/, b.coach.split(" ").slice(-2)[0]);
      if (surname.length * 6.4 + 8 <= w) {
        svg += '<text class="coach" x="' + (left + 4).toFixed(1) + '" y="' + (height - m.b - 6) + '">' + esc(surname) + "</text>";
      }
    });

    [-0.2, 0, 0.2, 0.4].forEach(function (v) {
      if (v < y0 || v > y1) return;
      svg += '<line class="' + (v === 0 ? "zero" : "grid") + '" x1="' + m.l + '" x2="' + (width - m.r) + '" y1="' + y(v).toFixed(1) +
        '" y2="' + y(v).toFixed(1) + '"/>';
      svg += '<text class="tick" x="' + (m.l - 6) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end">' + pct(v) + "</text>";
    });
    var every = slot < 34 ? 2 : 1;
    for (var s = data.first; s <= data.last; s++) {
      if ((s - data.first) % every) continue;
      svg += '<text class="tick" x="' + x(s).toFixed(1) + '" y="' + (height - 8) + '" text-anchor="middle">’' + String(s).slice(2) + "</text>";
    }

    segments(team, data).forEach(function (run) {
      if (run.length > 1) {
        svg += '<polyline class="line" points="' + run.map(function (p) { return x(p[0]).toFixed(1) + "," + y(p[1]).toFixed(1); }).join(" ") + '"/>';
      }
    });
    team.seasons.forEach(function (p) {
      if (data.skip.indexOf(p[0]) >= 0) return;
      var thin = p[2] < data.min_telecasts;
      svg += '<circle class="pt' + (thin ? " thin" : "") + '" cx="' + x(p[0]).toFixed(1) + '" cy="' + y(p[1]).toFixed(1) + '" r="' +
        (thin ? 3.6 : 4.4) + '"><title>' + esc(p[0] + ": " + pct(p[1]) + " against " + team.name + "’s long-run draw (" + p[2] +
        (p[2] === 1 ? " measured telecast)" : " measured telecasts)")) + "</title></circle>";
    });
    return svg + "</svg>";
  }

  function start(data) {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var teams = data.teams;
    var initial = 0;
    teams.forEach(function (t, i) { if (t.name === "Colorado") initial = i; });
    mount.innerHTML = '<div class="cfbtl"><label for="cfbtl-team">Program</label><div class="cfbtl-pick"><select id="cfbtl-team">' +
      teams.map(function (t, i) {
        return '<option value="' + i + '"' + (i === initial ? " selected" : "") + ">" + esc(t.name) + "</option>";
      }).join("") + '</select><img class="cfbtl-logo" id="cfbtl-logo" alt=""></div>' +
      '<div class="cfbtl-head" id="cfbtl-head"></div><div class="cfbtl-chart" id="cfbtl-chart"></div>' +
      '<div class="cfbtl-note">Each point is one season’s audience against the program’s own long-run draw, with the slot, network, ' +
      "rankings and opponent held equal, so 0% is a normal year for that program. Shaded bands are head coaches. Hollow points rest on fewer than " +
      data.min_telecasts + " measured telecasts and lean toward 0%; there is no 2020. Hover or tap a point or band for the details.</div></div>";

    var sel = document.getElementById("cfbtl-team"), chart = document.getElementById("cfbtl-chart");
    var logo = document.getElementById("cfbtl-logo"), head = document.getElementById("cfbtl-head");
    var LOGOS = base + "../shared/logos/";
    function render() {
      var team = teams[+sel.value];
      if (team.id) { logo.src = LOGOS + team.id + ".png"; logo.alt = team.name; logo.style.visibility = "visible"; }
      else { logo.removeAttribute("src"); logo.style.visibility = "hidden"; }
      head.textContent = team.name + ": long-run draw ×" + team.draw.toFixed(2) + " an average program";
      chart.innerHTML = draw(team, data, Math.max(300, Math.floor(chart.clientWidth || mount.clientWidth || 600)));
    }
    sel.addEventListener("change", render);
    var pending;
    window.addEventListener("resize", function () { clearTimeout(pending); pending = setTimeout(render, 120); });
    render();
  }

  fetch(base + "coach-timeline.json" + (version ? "?v=" + version : ""))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(start)
    .catch(function () { mount.innerHTML = "<p><em>The coach timeline could not load its data.</em></p>"; });
})();
