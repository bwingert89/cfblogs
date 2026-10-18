/* Audience calculator for the viewership post.
 *
 * Mounts into #cfb-viewership-calculator. Reads calculator.json from the folder this script was loaded from,
 * builds a row of labelled dropdowns, and multiplies the model's baseline audience by one factor per choice,
 * live. The model is additive in log viewers, so every effect is a multiplier and they compound.
 */
(function () {
  "use strict";

  var RANK_ORDER = ["unranked", "11-25", "6-10", "top 5"];

  // ---- the arithmetic, kept pure so it can be checked without a page ------------------------------------
  function compute(data, s) {
    var o = data.options;
    var t1 = s.team1, t2 = s.team2;
    var rows = [];
    var add = function (label, detail, mult) { rows.push({ label: label, detail: detail, mult: mult }); };

    add("Team 1 draw", t1.name, t1.draw);
    add("Team 2 draw", t2.name, t2.draw);
    add("Network", o.network[s.network][0], o.network[s.network][1]);
    add("Kickoff", o.window[s.window][0], o.window[s.window][1]);

    var r1 = o.rank[s.rank1][1], r2 = o.rank[s.rank2][1];
    var better = RANK_ORDER.indexOf(r1) >= RANK_ORDER.indexOf(r2) ? r1 : r2;
    var worse = better === r1 ? r2 : r1;
    var rankLabel = function (r) { return r === "unranked" ? "unranked" : r === "top 5" ? "top 5" : "ranked " + r.replace("-", " to "); };
    add("Better-ranked team", rankLabel(better), o.rank_high[better]);
    add("Worse-ranked team", rankLabel(worse), o.rank_low[worse]);

    add("Stakes", o.stakes[s.stakes][0], o.stakes[s.stakes][1]);
    add("Site", o.site[s.site][0], o.site[s.site][1]);

    // The matchup flags follow from the two teams (2025 conferences), not from a dropdown.
    var known = t1.conference !== undefined && t2.conference !== undefined;
    if (known) {
      var sameConf = t1.conference_play && t2.conference_play && t1.conference === t2.conference;
      add("Conference game", sameConf ? "yes, both " + t1.conference : "no", sameConf ? data.flags.conference_game : 1);
      var fbs1 = t1.conference !== null, fbs2 = t2.conference !== null;
      if (!fbs1 || !fbs2) add("Opponent level", fbs1 || fbs2 ? "FBS against FCS" : "neither team FBS in " + data.season, data.flags.fbs_fcs);
      else if (t1.power !== t2.power) add("Opponent level", "power conference against Group of Five", data.flags.power_g5);
      else add("Opponent level", t1.power ? "both power conference" : "both Group of Five", 1);
    } else {
      add("Conference game", "not applied to an average program", 1);
      add("Opponent level", "not applied to an average program", 1);
    }

    var nb = Math.min(s.broadcast, s.competing);
    add("Other games at the same time", s.competing + (s.competing === 1 ? " measured game" : " measured games"), Math.pow(data.competing, s.competing));
    add("…of them on broadcast TV", nb + " on ABC, CBS, FOX or NBC", Math.pow(data.competing_broadcast, nb));

    var total = data.baseline;
    rows.forEach(function (r) { total *= r.mult; });
    return { rows: rows, audience: total, low: total / data.miss_factor, high: total * data.miss_factor };
  }

  if (typeof document === "undefined") {           // no page: expose the arithmetic for the checks
    var root = typeof globalThis !== "undefined" ? globalThis : this;
    root.cfbCalcCompute = compute;
    if (typeof module !== "undefined") module.exports = { compute: compute };
    return;
  }

  var mount = document.getElementById("cfb-viewership-calculator");
  if (!mount || mount.getAttribute("data-ready")) return;
  mount.setAttribute("data-ready", "1");

  var script = document.currentScript || (function () {
    var all = document.getElementsByTagName("script");
    for (var i = all.length - 1; i >= 0; i--) if (/calculator\.js/.test(all[i].src)) return all[i];
    return null;
  })();
  var src = script ? script.src : "";
  var base = src.replace(/calculator\.js.*$/, "");
  var version = (src.match(/[?&]v=([^&]+)/) || [])[1] || "";

  var CSS = [
    ".cfbcalc{margin:1.6rem 0 2rem;padding:1.1rem 1.1rem 1.2rem;border:1px solid rgba(127,115,95,.35);border-radius:8px;font-size:.95rem;line-height:1.4}",
    ".cfbcalc *{box-sizing:border-box}",
    ".cfbcalc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem .8rem}",
    ".cfbcalc-field{display:flex;flex-direction:column;justify-content:flex-end;min-width:0}",
    ".cfbcalc-field.wide{grid-column:span 2}",
    "@media (max-width:560px){.cfbcalc-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}",
    ".cfbcalc label{font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;opacity:.7;margin-bottom:.25rem}",
    ".cfbcalc select{font:inherit;font-size:.9rem;width:100%;min-width:0;max-width:100%;text-overflow:ellipsis;padding:.35rem .4rem;border:1px solid rgba(127,115,95,.45);border-radius:5px;background:transparent;color:inherit}",
    ".cfbcalc select option{color:#241E16;background:#FBF7F0}",
    ".cfbcalc-rows{margin-top:1.1rem;border-top:1px solid rgba(127,115,95,.3)}",
    ".cfbcalc-row{display:grid;grid-template-columns:minmax(0,11rem) minmax(0,1fr) auto;gap:.6rem;padding:.32rem 0;border-bottom:1px solid rgba(127,115,95,.15);align-items:baseline}",
    "@media (max-width:420px){.cfbcalc-row{grid-template-columns:minmax(0,1fr) auto}.cfbcalc-row .d{grid-column:1;grid-row:2;font-size:.82rem}}",
    ".cfbcalc-row .l{font-weight:600}",
    ".cfbcalc-row .d{opacity:.75;min-width:0;overflow-wrap:anywhere}",
    ".cfbcalc-row .m{font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}",
    ".cfbcalc-row.up .m{color:#3E6B4F}.cfbcalc-row.down .m{color:#9A4B3C}.cfbcalc-row.flat .m{opacity:.45}",
    "@media (prefers-color-scheme:dark){.cfbcalc-row.up .m{color:#7FB894}.cfbcalc-row.down .m{color:#D98C7A}}",
    ".cfbcalc-out{margin-top:1rem;display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem 1rem}",
    ".cfbcalc-out .big{font-size:2rem;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.1}",
    ".cfbcalc-out .range{opacity:.75}",
    ".cfbcalc-note{margin-top:.5rem;font-size:.8rem;opacity:.65}"
  ].join("\n");

  var esc = function (t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };
  var viewers = function (v) { return v >= 1e6 ? (v / 1e6).toFixed(v >= 1e7 ? 1 : 2) + "M" : Math.round(v / 1e3) + "K"; };
  var times = function (m) { return "×" + m.toFixed(2); };

  function start(data) {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var average = { name: "An average program", draw: 1 };     // no conference: the matchup flags are not applied
    var teams = [average].concat(data.teams);
    var teamLabel = function (t) {
      if (t === average) return t.name + " (×1.00)";
      var where = t.conference === null ? "FCS" : t.conference === "FBS Independents" ? "Independent" : t.conference;
      return t.name + " (" + where + ")";
    };
    var byName = function (name) { for (var i = 0; i < teams.length; i++) if (teams[i].name === name) return i; return 0; };

    var o = data.options;
    var range = function (n) { var a = []; for (var i = 0; i <= n; i++) a.push([String(i), i]); return a; };
    var FIELDS = [
      { key: "team1", label: "Team 1", wide: true, items: teams.map(function (t) { return [teamLabel(t)]; }), value: byName("Iowa State") },
      { key: "team2", label: "Team 2", wide: true, items: teams.map(function (t) { return [teamLabel(t)]; }), value: byName("Iowa") },
      { key: "rank1", label: "Team 1 ranking", items: o.rank, value: 1 },
      { key: "rank2", label: "Team 2 ranking", items: o.rank, value: 0 },
      { key: "network", label: "Network", items: o.network, value: 2 },
      { key: "window", label: "Kickoff", items: o.window, value: 0 },
      { key: "stakes", label: "Stakes", items: o.stakes, value: 0 },
      { key: "site", label: "Site", items: o.site, value: 0 },
      { key: "competing", label: "Other games at the same time", items: range(10), value: 5 },
      { key: "broadcast", label: "Of those, on broadcast TV", items: range(4), value: 1 }
    ];

    var html = '<div class="cfbcalc"><div class="cfbcalc-grid">';
    FIELDS.forEach(function (f) {
      html += '<div class="cfbcalc-field' + (f.wide ? " wide" : "") + '"><label for="cfbcalc-' + f.key + '">' + esc(f.label) + "</label>" +
        '<select id="cfbcalc-' + f.key + '">' + f.items.map(function (it, i) {
          return '<option value="' + i + '"' + (i === f.value ? " selected" : "") + ">" + esc(it[0]) + "</option>";
        }).join("") + "</select></div>";
    });
    html += '</div><div class="cfbcalc-rows" id="cfbcalc-rows"></div><div class="cfbcalc-out" id="cfbcalc-out"></div>' +
      '<div class="cfbcalc-note">Conferences and the season effect are ' + data.season + "'s. Each choice multiplies the one above it; " +
      "the range is the model's typical miss of a factor of " + data.miss_factor + " either way.</div></div>";
    mount.innerHTML = html;

    var sel = {};
    FIELDS.forEach(function (f) { sel[f.key] = document.getElementById("cfbcalc-" + f.key); });

    function render() {
      var n = +sel.competing.value;
      if (+sel.broadcast.value > Math.min(n, 4)) sel.broadcast.value = String(Math.min(n, 4));
      Array.prototype.forEach.call(sel.broadcast.options, function (opt) { opt.disabled = +opt.value > n; });
      var state = {
        team1: teams[+sel.team1.value], team2: teams[+sel.team2.value],
        rank1: +sel.rank1.value, rank2: +sel.rank2.value, network: +sel.network.value, window: +sel.window.value,
        stakes: +sel.stakes.value, site: +sel.site.value, competing: n, broadcast: +sel.broadcast.value
      };
      var res = compute(data, state);
      var rows = '<div class="cfbcalc-row flat"><span class="l">Baseline</span><span class="d">two average programs, unranked, regular season, ' +
        "Saturday 2 to 6 pm ET on ESPN, " + data.season + " audience levels</span><span class=\"m\">" + viewers(data.baseline) + "</span></div>";
      res.rows.forEach(function (r) {
        var cls = Math.abs(r.mult - 1) < 0.005 ? "flat" : r.mult > 1 ? "up" : "down";
        rows += '<div class="cfbcalc-row ' + cls + '"><span class="l">' + esc(r.label) + '</span><span class="d">' + esc(r.detail) +
          '</span><span class="m">' + times(r.mult) + "</span></div>";
      });
      document.getElementById("cfbcalc-rows").innerHTML = rows;
      var same = state.team1 === state.team2 && state.team1 !== average;
      document.getElementById("cfbcalc-out").innerHTML = '<span>Typical audience</span><span class="big">' + viewers(res.audience) +
        '</span><span class="range">most games like this land between ' + viewers(res.low) + " and " + viewers(res.high) + "</span>" +
        (same ? '<span class="range">(pick two different teams)</span>' : "");
    }
    FIELDS.forEach(function (f) { sel[f.key].addEventListener("change", render); });
    render();
  }

  fetch(base + "calculator.json" + (version ? "?v=" + version : ""))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(start)
    .catch(function () { mount.innerHTML = "<p><em>The audience calculator could not load its data.</em></p>"; });
})();
