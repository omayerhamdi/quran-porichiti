/* ============================================================
   আল-কুরআন: এক নজরে — অ্যাপ্লিকেশন লজিক
   হ্যাশ-রাউটিং SPA; কনটেন্ট আসে js/data.js থেকে।
   ============================================================ */

(function () {
  "use strict";

  const ROUTES = [
    { hash: "intro",    label: "সূচনা",            ic: "🕮" },
    { hash: "streams",  label: "পাঁচ ধারা",         ic: "﴿﴾" },
    { hash: "prophets", label: "নবীগণের সিলসিলা",  ic: "☽" },
    { hash: "israel",   label: "বনী ইসরাঈল",       ic: "🏛" },
    { hash: "ulum",     label: "কুরআন বোঝার জ্ঞান", ic: "✎" },
    { hash: "sources",  label: "উৎস ও পাঠক্রম",    ic: "📚" }
  ];

  const $ = (sel, el = document) => el.querySelector(sel);
  const main = () => $("#page-container");

  /* বাংলা সংখ্যা */
  const bnDigits = "০১২৩৪৫৬৭৮৯";
  const toBn = n => String(n).replace(/\d/g, d => bnDigits[d]);

  /* ---------- সাধারণ কম্পোনেন্ট ---------- */

  function faqHTML(faqs) {
    if (!faqs || !faqs.length) return "";
    return `<div class="section">
      <h2>জিজ্ঞাসা ও জবাব</h2>
      <p class="section-note">পড়তে পড়তে মনে যে প্রশ্নগুলো জাগে, সেগুলোরই জবাব। প্রশ্নে চাপ দিন।</p>
      ${faqs.map(f => `
        <div class="acc">
          <button class="acc-q" aria-expanded="false">
            <span class="qm">প্রশ্ন</span><span>${f.q}</span><span class="chev">▾</span>
          </button>
          <div class="acc-a"><div class="acc-a-inner">${f.a}</div></div>
        </div>`).join("")}
    </div>`;
  }

  function bindAccordions(root) {
    root.querySelectorAll(".acc-q").forEach(btn => {
      btn.addEventListener("click", () => {
        const acc = btn.closest(".acc");
        const body = acc.querySelector(".acc-a");
        const open = acc.classList.toggle("open");
        btn.setAttribute("aria-expanded", open);
        body.style.maxHeight = open ? body.scrollHeight + "px" : "0";
      });
    });
  }

  function bindToggles(root, headSel, cardSel) {
    root.querySelectorAll(headSel).forEach(h => {
      h.addEventListener("click", () => h.closest(cardSel).classList.toggle("open"));
    });
  }

  const srcHTML = s => s ? `<div class="src">${s}</div>` : "";

  function pageTitle(t, sub) {
    return `<span class="page-title-orn">✦ ✦ ✦</span>
      <h1 class="page-title">${t}</h1>
      ${sub ? `<p class="lead">${sub}</p>` : ""}`;
  }

  function nextNav(prev, next) {
    return `<div class="next-nav">
      ${prev ? `<a class="next-link" href="#/${prev.hash}">← ${prev.label}</a>` : "<span></span>"}
      ${next ? `<a class="next-link" href="#/${next.hash}">${next.label} →</a>` : "<span></span>"}
    </div>`;
  }

  /* সংখ্যা গণনা অ্যানিমেশন */
  function animateCounters(root) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target; obs.unobserve(el);
        const target = +el.dataset.count, suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const dur = 900, t0 = performance.now();
        (function tick(t) {
          const p = Math.min((t - t0) / dur, 1);
          const val = Math.round(target * (1 - Math.pow(1 - p, 3)));
          el.textContent = prefix + toBn(val.toLocaleString("en-US")) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: .4 });
    root.querySelectorAll("[data-count]").forEach(el => obs.observe(el));
  }

  /* ---------- পেজ ১: সূচনা ---------- */
  function renderIntro() {
    const d = DATA.intro;
    const mm = d.makkiMadani, total = mm.makki + mm.madani;
    const mkPct = (mm.makki / total * 100).toFixed(1);
    return {
      html: `
      ${pageTitle(d.title)}
      <p class="lead">${d.lead1}</p>
      <p class="lead" style="margin-top:14px">${d.lead2}</p>
      <p class="lead" style="margin-top:14px">${d.lead3}</p>

      <div class="section">
        <h2>মৌলিক পরিচিতি</h2>
        <div class="grid c3">
          ${d.stats.map(s => `
            <div class="card stat">
              <div class="num" ${s.num > 20 ? `data-count="${s.num}" ${s.bn.startsWith("≈") ? 'data-prefix="≈"' : ""}` : ""}>${s.bn}</div>
              <div class="lbl">${s.label}</div>
              <div class="nt">${s.note}</div>
            </div>`).join("")}
        </div>
      </div>

      <div class="section">
        <h2>মাক্কী ও মাদানী সূরার অনুপাত</h2>
        <p class="section-note">প্রসিদ্ধ গণনা অনুযায়ী। ক'টি সূরা নিয়ে আলিমদের মতভেদ আছে — কথাটা নিচের জিজ্ঞাসায় বলা হয়েছে।</p>
        <div class="mm-bar" role="img" aria-label="মাক্কী ৮৬, মাদানী ২৮">
          <div class="mk" style="width:${mkPct}%">মাক্কী — ${toBn(mm.makki)}টি</div>
          <div class="md" style="width:${100 - mkPct}%">মাদানী — ${toBn(mm.madani)}টি</div>
        </div>
      </div>

      <div class="section">
        <h2>পুরো কুরআন যে তিনটি মৌলিক বিষয়ে আবর্তিত</h2>
        <p class="section-note">${d.themesIntro}</p>
        <div class="grid c3">
          ${d.themes.map(t => `
            <div class="card theme-card" tabindex="0" role="button" aria-expanded="false">
              <span class="t-ar">${t.ar}</span>
              <h3>${t.name}</h3>
              <div class="t-short">${t.short}</div>
              <div class="t-desc">${t.desc}</div>
              <div class="t-hint">একটু বিস্তারিত দেখুন ▾</div>
            </div>`).join("")}
        </div>
      </div>

      <div class="section">
        <h2>${d.tasrif.title}</h2>
        <p class="section-note">${d.tasrif.intro}</p>
        <div class="grid c2">
          ${d.tasrif.items.map(i => `
            <div class="card tasrif-item">
              <span class="ic">${i.icon}</span>
              <div><b>${i.t}</b><p>${i.d}</p></div>
            </div>`).join("")}
        </div>
      </div>

      ${faqHTML(d.faq)}
      ${srcHTML(d.sources)}
      ${nextNav(null, ROUTES[1])}`,
      after(root) {
        animateCounters(root);
        root.querySelectorAll(".theme-card").forEach(c => {
          const toggle = () => {
            c.classList.toggle("open");
            c.setAttribute("aria-expanded", c.classList.contains("open"));
            c.querySelector(".t-hint").textContent = c.classList.contains("open") ? "গুটিয়ে নিন ▴" : "একটু বিস্তারিত দেখুন ▾";
          };
          c.addEventListener("click", toggle);
          c.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
        });
      }
    };
  }

  /* ---------- পেজ ২: পাঁচ ধারা ---------- */
  function renderStreams() {
    const d = DATA.streams;
    return {
      html: `
      ${pageTitle(d.title)}
      <p class="lead">${d.intro1}</p>
      <p class="lead" style="margin-top:14px">${d.intro2}</p>

      <div class="section">
        <h2>পাঁচটি ধারা</h2>
        <p class="section-note">এক এক করে দেখুন — কোন ধারায় চাপ দিলে ভেতরে ব্যাখ্যা আর কুরআনের উদাহরণ পাবেন।</p>
        ${d.list.map(s => `
          <div class="card stream ${s.color}">
            <div class="stream-head" role="button" tabindex="0" aria-expanded="false">
              <span class="stream-num">${s.n}</span>
              <div><h3>${s.name}</h3><div class="s-sub">${s.sub}</div></div>
              <span class="s-ar">${s.ar}</span>
            </div>
            <div class="stream-body">
              <p>${s.desc}</p>
              <div class="stream-ex">${s.ex}</div>
            </div>
          </div>`).join("")}
      </div>

      <div class="section">
        <h2>${d.mapping.title}</h2>
        <p class="section-note">${d.mapping.note}</p>
        <div class="card">
          ${d.mapping.links.map(l => `
            <div class="map-row">
              <span>${l.from}</span><span class="arrow">⟶</span><span class="to">${l.to}</span>
              <span class="d">${l.d}</span>
            </div>`).join("")}
        </div>
      </div>

      <div class="section">
        <h2>${d.quiz.title}</h2>
        <p class="section-note">${d.quiz.intro}</p>
        <div class="card quiz" id="quiz-box"></div>
      </div>

      ${faqHTML(d.faq)}
      ${srcHTML(d.sources)}
      ${nextNav(ROUTES[0], ROUTES[2])}`,
      after(root) {
        bindToggles(root, ".stream-head", ".stream");
        root.querySelectorAll(".stream-head").forEach(h => h.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); h.click(); }
        }));
        initQuiz(root.querySelector("#quiz-box"), d.quiz);
      }
    };
  }

  function initQuiz(box, quiz) {
    let idx = 0; const results = [];

    function progHTML() {
      return `<div class="quiz-prog">${quiz.questions.map((_, i) =>
        `<span class="${i < idx ? (results[i] ? "done-ok" : "done-bad") : i === idx ? "cur" : ""}"></span>`).join("")}</div>`;
    }

    function showQ() {
      if (idx >= quiz.questions.length) return showScore();
      const q = quiz.questions[idx];
      box.innerHTML = `
        ${progHTML()}
        <div class="quiz-q">${toBn(idx + 1)}/${toBn(quiz.questions.length)} — ${q.text}</div>
        <div class="quiz-opts">
          ${quiz.options.map((o, i) => `<button class="quiz-opt" data-i="${i}">${o}</button>`).join("")}
        </div>
        <div class="quiz-why"></div>
        <button class="quiz-next">পরের প্রশ্ন ↤</button>`;
      box.querySelectorAll(".quiz-opt").forEach(btn => btn.addEventListener("click", () => {
        const chosen = +btn.dataset.i, ok = chosen === q.ans;
        results[idx] = ok;
        box.querySelectorAll(".quiz-opt").forEach(b => {
          b.disabled = true;
          if (+b.dataset.i === q.ans) b.classList.add("correct");
          else if (+b.dataset.i === chosen) b.classList.add("wrong");
        });
        const why = box.querySelector(".quiz-why");
        why.innerHTML = (ok ? "✅ ঠিক ধরেছেন। " : "🔁 এবার হলো না — সঠিকটি সবুজ করে দেখানো হলো। ") + q.why;
        why.classList.add("show");
        const nx = box.querySelector(".quiz-next");
        nx.textContent = idx + 1 < quiz.questions.length ? "পরেরটি দেখি →" : "ফলাফল দেখি →";
        nx.classList.add("show");
        nx.addEventListener("click", () => { idx++; showQ(); }, { once: true });
      }));
    }

    function showScore() {
      const score = results.filter(Boolean).length;
      box.innerHTML = `
        <div class="quiz-score">
          <div class="big">${toBn(score)} / ${toBn(quiz.questions.length)}</div>
          <p>${score === quiz.questions.length
            ? "মাশাআল্লাহ! পাঁচটি ধারাই আপনার ধরা হয়ে গেছে। এবার কুরআন খুলুন — দেখবেন, আলোচনা আর এলোমেলো লাগছে না।"
            : score >= Math.ceil(quiz.questions.length * .6)
              ? "বেশ হয়েছে। যে ক'টি ভুল হলো, ওগুলোর ব্যাখ্যা আরেকবার চোখ বুলিয়ে নিন — কাঁচা জায়গাটা ওখানেই।"
              : "ভয়ের কিছু নেই। উপরে ফিরে গিয়ে পাঁচটি ধারা আরেকবার পড়ুন, তারপর আবার বসুন — এবার অনেক সহজ লাগবে ইনশাআল্লাহ।"}</p>
          <button class="quiz-next show" style="margin-top:10px">আরেকবার বসি ⟲</button>
        </div>`;
      box.querySelector(".quiz-next").addEventListener("click", () => { idx = 0; results.length = 0; showQ(); });
    }

    showQ();
  }

  /* ---------- পেজ ৩: নবীগণের সিলসিলা ---------- */
  function renderProphets() {
    const d = DATA.prophets;
    const maxMention = 136;

    const pcardHTML = p => `
      <div class="card pcard ${p.ulul ? "ulul" : ""}" id="p-${p.n}">
        <div class="pcard-head" role="button" tabindex="0" aria-expanded="false">
          <span class="pcard-no">${toBn(p.n)}</span>
          <span class="pcard-name">${p.name} ${p.n === 25 ? "" : "আলাইহিস সালাম"}</span>
          <span class="pcard-ar">${p.ar}</span>
          ${p.ulul ? `<span class="badge ulul">উলুল আযম</span>` : ""}
          ${p.book ? `<span class="badge book">কিতাব: ${p.book}</span>` : ""}
          ${p.ikhtilaf ? `<span class="badge ikh">মতভেদ আছে</span>` : ""}
          <span class="pcard-chev">▾</span>
          <div class="pcard-title">${p.title}</div>
        </div>
        <div class="pcard-body">
          <p class="story">${p.story}</p>
          <div class="mention-bar">
            <span>কুরআনে নামোল্লেখ</span>
            <div class="track"><div class="fill" data-w="${Math.max(p.mentions / maxMention * 100, 3)}"></div></div>
            <b>${toBn(p.mentions)} বার</b>
          </div>
          ${p.note ? `<div class="pcard-note">${p.note}</div>` : ""}
          <div class="pcard-refs">${p.refs}</div>
          ${p.ikhtilaf ? `<div class="pcard-ikh">${p.ikhtilaf}</div>` : ""}
        </div>
      </div>`;

    /* ---- সিলসিলা-মানচিত্র (SVG) ---- */
    const M = d.map;
    const byId = Object.fromEntries(M.nodes.map(n => [n.id, n]));
    const nodeW = n => n.w || 140;
    const nodeH = n => n.small ? 24 : (n.sub ? 46 : 34);

    /* দুই নোডের মাঝে সংযোগরেখা: খাড়া হলে কনুই-বাঁক, পাশাপাশি হলে সরলরেখা */
    function edgePath(e) {
      const b = byId[e.b], bw = nodeW(b) / 2, bh = nodeH(b) / 2;
      if (e.tap) {
        const [tx, ty] = e.tap;
        const side = b.x < tx ? b.x + bw : b.x - bw;   // নোডের যে পাশ মূল রেখার দিকে
        if (b.y === ty) return `M${tx} ${ty} L${side} ${ty}`;
        const mx = (tx + side) / 2;                    // বন্ধনী-আকৃতির বাঁক
        return `M${tx} ${ty} L${mx} ${ty} L${mx} ${b.y} L${side} ${b.y}`;
      }
      const a = byId[e.a], aw = nodeW(a) / 2, ah = nodeH(a) / 2;
      if (e.t === "h") {
        const [x1, x2] = a.x < b.x ? [a.x + aw, b.x - bw] : [a.x - aw, b.x + bw];
        return `M${x1} ${a.y} L${x2} ${b.y}`;
      }
      const y1 = a.y + ah, y2 = b.y - bh, mid = (y1 + y2) / 2;
      return a.x === b.x
        ? `M${a.x} ${y1} L${b.x} ${y2}`
        : `M${a.x} ${y1} L${a.x} ${mid} L${b.x} ${mid} L${b.x} ${y2}`;
    }

    const chipHTML = c => {
      const h = c.lines.length * 15 + 10;
      return `<g class="mp-chip ${c.cls}">
        <rect x="${c.x - c.w / 2}" y="${c.y - h / 2}" width="${c.w}" height="${h}" rx="9"/>
        ${c.lines.map((ln, i) =>
          `<text x="${c.x}" y="${c.y - h / 2 + 16 + i * 15}" text-anchor="middle">${ln}</text>`).join("")}
      </g>`;
    };

    const mapNodeHTML = n => {
      const w = nodeW(n), h = nodeH(n), p = n.n ? d.eras.flatMap(e => e.prophets).find(x => x.n === n.n) : null;
      const tip = p ? `${p.name} আলাইহিস সালাম — ${p.title} · কুরআনে ${toBn(p.mentions)} বার` : `${n.name} — ${n.sub || ""}`;
      const nameY = n.sub && !n.small ? n.y - 3 : n.y + (n.small ? 4 : 5);
      return `<g class="mp-node ${n.kind}${n.n ? " clickable" : ""}"
                 ${n.n ? `data-n="${n.n}" role="button" tabindex="0"` : ""}
                 data-tip="${tip.replace(/"/g, "&quot;")}">
        <rect x="${n.x - w / 2}" y="${n.y - h / 2}" width="${w}" height="${h}" rx="${n.small ? 12 : 10}"/>
        <text class="mp-name" x="${n.x}" y="${nameY}" text-anchor="middle"
              style="font-size:${n.small ? 12 : 14}px">${n.name}</text>
        ${n.sub && !n.small ? `<text class="mp-sub" x="${n.x}" y="${n.y + 13}" text-anchor="middle">${n.sub}</text>` : ""}
      </g>`;
    };

    const mapHTML = () => `
      <div class="mp-wrap">
        <div class="mp-legend">
          ${M.legend.map(l => `<span class="mp-lg ${l.k}"><i></i>${l.t}</span>`).join("")}
        </div>
        <div class="mp-scroll">
          <svg viewBox="${M.vb}" class="mp-svg" role="img"
               aria-label="আদম আলাইহিস সালাম থেকে মুহাম্মাদ ﷺ পর্যন্ত নবীগণের সিলসিলা-মানচিত্র">
            ${M.bands.map(b => `
              <g class="mp-band">
                <rect x="8" y="${b.y}" width="944" height="${b.h}" rx="14"/>
                <text x="26" y="${b.y + 21}">${b.t}</text>
              </g>`).join("")}
            ${M.paths.map(p => `<path class="mp-path ${p.cls}" d="${p.d}"><title>${p.title}</title></path>`).join("")}
            ${M.edges.map(e => `<path class="mp-edge${e.d ? " dashed" : ""}" d="${edgePath(e)}"/>`).join("")}
            ${M.chips.map(chipHTML).join("")}
            ${M.nodes.map(mapNodeHTML).join("")}
          </svg>
        </div>
        <div class="mp-tip" hidden></div>
      </div>`;

    /* মানচিত্রের নোডে চাপ → নিচের সংশ্লিষ্ট কার্ড খুলে সেখানে নিয়ে যাওয়া */
    function bindMap(root) {
      const wrap = root.querySelector(".mp-wrap");
      if (!wrap) return;
      const tip = wrap.querySelector(".mp-tip");

      wrap.querySelectorAll(".mp-node").forEach(g => {
        g.addEventListener("mouseenter", () => {
          tip.textContent = g.dataset.tip;
          tip.hidden = false;
        });
        g.addEventListener("mousemove", e => {
          const r = wrap.getBoundingClientRect();
          tip.style.left = Math.min(Math.max(e.clientX - r.left, 90), r.width - 90) + "px";
          tip.style.top = (e.clientY - r.top - 14) + "px";
        });
        g.addEventListener("mouseleave", () => { tip.hidden = true; });

        if (!g.dataset.n) return;
        const go = () => {
          const card = root.querySelector("#p-" + g.dataset.n);
          if (!card) return;
          card.classList.add("open");
          card.querySelector(".pcard-head").setAttribute("aria-expanded", "true");
          const fill = card.querySelector(".fill");
          requestAnimationFrame(() => { fill.style.width = fill.dataset.w + "%"; });
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.classList.remove("flash");
          void card.offsetWidth;            // অ্যানিমেশন রিস্টার্ট করাতে
          card.classList.add("flash");
        };
        g.addEventListener("click", go);
        g.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
        });
      });
    }

    return {
      html: `
      ${pageTitle(d.title, "আদম আলাইহিস সালাম থেকে মুহাম্মাদ ﷺ — কুরআন যে ২৫ জন নবীর নাম নিয়েছে, তাঁরা এলেন একের পর এক, এক ধারায় গাঁথা। প্রথমে পুরো ছবিটা মানচিত্রে দেখে নিন; তারপর একজন একজন করে।")}

      <div class="section basics">
        <h2>শুরুর কথা: চারটি মৌলিক জ্ঞান</h2>
        <p class="section-note">নবীদের ধারায় ঢোকার আগে এ চারটি কথা পরিষ্কার থাকা চাই — নইলে পদে পদে খটকা লাগবে।</p>
        <div class="grid c2">
          ${d.basics.map(b => `<div class="card"><b class="bt">${b.t}</b><p>${b.d}</p></div>`).join("")}
        </div>
      </div>

      <div class="section">
        <h2>${M.title}</h2>
        <p class="section-note">${M.note} <span class="mp-hint">${M.hint}</span></p>
        ${mapHTML()}
      </div>

      <div class="divider-orn">✦ ✦ ✦</div>
      <p class="section-note" style="text-align:center">
        এবার একজন একজন করে — যুগ ধরে, ধারা ধরে।
      </p>

      ${d.eras.map(era => `
        <div class="era">
          <div class="era-head">
            <h2>${era.title}</h2>
            ${era.lesson ? `<div class="era-lesson">${era.lesson}</div>` : ""}
          </div>
          <div class="timeline">
            ${era.prophets.map((p, i) => {
              let out = pcardHTML(p);
              if (era.id === 1 && p.n === 1 && era.bridgeBefore) out += `<div class="bridge">${era.bridgeBefore.replace(/ <i>\(এ সংযোগ-টেক্সটটি.*?\)<\/i>/, "")}</div>`;
              if (era.id === 3 && p.n === 16 && era.bridgeMid) out += `<div class="bridge">${era.bridgeMid.replace(/ <i>\(এ সংযোগটি.*?\)<\/i>/, "")}</div>`;
              return out;
            }).join("")}
          </div>
          ${era.bridge ? `<div class="bridge">${era.bridge}</div>` : ""}
        </div>`).join("")}

      ${faqHTML(d.faq)}
      ${srcHTML(d.sources)}
      ${nextNav(ROUTES[1], ROUTES[3])}`,
      after(root) {
        bindMap(root);
        bindToggles(root, ".pcard-head", ".pcard");
        root.querySelectorAll(".pcard-head").forEach(h => h.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); h.click(); }
        }));
        /* মেনশন বার অ্যানিমেশন — কার্ড খোলার সময় */
        root.querySelectorAll(".pcard-head").forEach(h => h.addEventListener("click", () => {
          const card = h.closest(".pcard");
          if (card.classList.contains("open")) {
            const fill = card.querySelector(".fill");
            requestAnimationFrame(() => { fill.style.width = fill.dataset.w + "%"; });
          }
        }));
      }
    };
  }

  /* ---------- পেজ ৪: বনী ইসরাঈল ---------- */
  function renderIsrael() {
    const d = DATA.israel;

    /* উত্থান-পতনের রেখাচিত্র: ৬ পর্বের tone অনুযায়ী */
    const pts = [
      { x: 60,  y: 95,  label: "মিসরে দাসত্ব" },
      { x: 210, y: 45,  label: "মুক্তি ও তাওরাত" },
      { x: 360, y: 22,  label: "স্বর্ণযুগ" },
      { x: 510, y: 92,  label: "পতন ও নির্বাসন" },
      { x: 660, y: 118, label: "ঈসা আ.-কে প্রত্যাখ্যান" },
      { x: 810, y: 60,  label: "আমানত হস্তান্তর" }
    ];
    const path = pts.map((p, i) => (i ? "L" : "M") + p.x + " " + p.y).join(" ");
    const arcSVG = `
      <div class="card arc-wrap" aria-hidden="true">
        <svg viewBox="0 0 880 170">
          <path d="${path}" fill="none" stroke="var(--gold-500)" stroke-width="2.5" stroke-dasharray="6 5"/>
          ${pts.map((p, i) => `
            <g class="arc-dot" data-phase="${i}">
              <circle cx="${p.x}" cy="${p.y}" r="13" fill="${i === 2 ? "var(--green-600)" : i === 5 ? "var(--gold-600)" : i === 1 ? "var(--green-600)" : "var(--danger)"}" opacity=".9"/>
              <text x="${p.x}" y="${p.y + 5}" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">${toBn(i + 1)}</text>
              <text class="arc-label" x="${p.x}" y="${p.y < 60 ? p.y - 20 : p.y + 30}" text-anchor="middle">${p.label}</text>
            </g>`).join("")}
        </svg>
      </div>`;

    return {
      html: `
      ${pageTitle(d.title)}

      <div class="section">
        <h2>বনী ইসরাঈল কারা?</h2>
        <div class="card"><p>${d.who}</p></div>
      </div>

      <div class="section">
        <h2>এক নজরে ছয় পর্ব — উত্থান ও পতনের রেখা</h2>
        <p class="section-note">রেখাটি উঠছে-নামছে জাতির অবস্থার সাথে সাথে। যে কোনো বিন্দুতে চাপ দিন — সেই পর্বটি নিচে খুলে যাবে।</p>
        ${arcSVG}
        ${d.phases.map((ph, i) => `
          <div class="card phase ${ph.tone}" id="phase-${i}">
            <div class="phase-head" role="button" tabindex="0" aria-expanded="false">
              <span class="phase-no">${ph.n}</span>
              <h3>${ph.title}</h3>
              <span class="ic">${ph.icon}</span>
              <span class="pcard-chev">▾</span>
            </div>
            <div class="phase-body">
              <p>${ph.body}</p>
              ${ph.list ? `<ul>${ph.list.map(li => `<li>${li}</li>`).join("")}</ul>` : ""}
              ${ph.after ? `<p>${ph.after}</p>` : ""}
              <div class="phase-refs">${ph.refs}</div>
            </div>
          </div>`).join("")}
      </div>

      <div class="section">
        <h2>${d.why.title}</h2>
        <p class="section-note">${d.why.intro}</p>
        ${d.why.mirrors.map(m => `
          <div class="mirror" style="margin-bottom:12px">
            <div class="m-they"><div class="m-head">তারা যা করেছিল</div>${m.they}</div>
            <div class="m-we"><div class="m-head">এ উম্মতের জন্য শিক্ষা</div>${m.we}</div>
          </div>`).join("")}
        <div class="card hadith-note"><p>${d.why.hadith}</p></div>
      </div>

      ${faqHTML(d.faq)}
      ${srcHTML(d.sources)}
      ${nextNav(ROUTES[2], ROUTES[4])}`,
      after(root) {
        bindToggles(root, ".phase-head", ".phase");
        root.querySelectorAll(".phase-head").forEach(h => h.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); h.click(); }
        }));
        root.querySelectorAll(".arc-dot").forEach(dot => dot.addEventListener("click", () => {
          const ph = root.querySelector("#phase-" + dot.dataset.phase);
          root.querySelectorAll(".phase.open").forEach(p => { if (p !== ph) p.classList.remove("open"); });
          ph.classList.add("open");
          ph.scrollIntoView({ behavior: "smooth", block: "center" });
        }));
      }
    };
  }

  /* ---------- পেজ ৫: উলূমুল কুরআন ---------- */
  function renderUlum() {
    const d = DATA.ulum;
    const tbl = d.makkiMadaniTable;
    return {
      html: `
      ${pageTitle(d.title)}
      <p class="lead">${d.intro}</p>

      <div class="section">
        <h2>আটটি মৌলিক বিষয়</h2>
        <p class="section-note">নামগুলো শুনতে ভারী, কিন্তু কথাগুলো সহজ। যেটিতে চাপ দেবেন, সেটির ব্যাখ্যা উদাহরণসহ খুলে যাবে।</p>
        ${d.topics.map(t => `
          <div class="card topic">
            <div class="topic-head" role="button" tabindex="0" aria-expanded="false">
              <span class="topic-ic">${t.icon}</span>
              <h3><span class="topic-no">${t.n}.</span> ${t.t}</h3>
              <span class="pcard-chev">▾</span>
            </div>
            <div class="topic-body">
              <p>${t.d}</p>
              ${t.table ? `<div class="table-scroll"><table class="cmp-table">
                  <tr>${tbl.head.map(h => `<th>${h}</th>`).join("")}</tr>
                  ${tbl.rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<td>${c}</td>` : `<td>${c}</td>`).join("")}</tr>`).join("")}
                </table></div>` : ""}
              ${t.ladder ? `<div class="ladder">
                  ${d.tafsirLadder.map(l => `
                    <div class="ladder-step"><span class="no"></span><div><b>${l.t}</b><p>${l.d}</p></div></div>`).join("")}
                </div>` : ""}
            </div>
          </div>`).join("")}
      </div>

      ${faqHTML(d.faq)}
      ${srcHTML(d.sources)}
      ${nextNav(ROUTES[3], ROUTES[5])}`,
      after(root) {
        bindToggles(root, ".topic-head", ".topic");
        root.querySelectorAll(".topic-head").forEach(h => h.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); h.click(); }
        }));
      }
    };
  }

  /* ---------- পেজ ৬: উৎসপঞ্জি ---------- */
  function renderSources() {
    const d = DATA.sources;
    return {
      html: `
      ${pageTitle(d.title)}
      <p class="lead">${d.intro}</p>

      <div class="section">
        <h2>অধ্যয়ন-পরিক্রমা: সহজ থেকে গভীরে</h2>
        ${d.steps.map(s => `
          <div class="card step-card">
            <span class="step-tag">${s.step}</span>
            <div><h3>${s.title}</h3><div class="auth">${s.author}</div><p>${s.d}</p></div>
          </div>`).join("")}
      </div>

      <div class="section">
        <h2>বিষয়ভিত্তিক মূল উৎস</h2>
        ${d.refs.map(s => `
          <div class="card step-card ref" style="margin-bottom:14px">
            <span class="step-tag">${s.cat}</span>
            <div><h3>${s.title}</h3><div class="auth">${s.author}</div><p>${s.d}</p></div>
          </div>`).join("")}
      </div>

      <div class="section">
        <h2>${d.integrity.title}</h2>
        <div class="card integrity">
          <ul>${d.integrity.items.map(i => `<li>${i}</li>`).join("")}</ul>
        </div>
      </div>

      <div class="divider-orn">✦ ✦ ✦</div>
      <p style="text-align:center;color:var(--ink-soft);font-size:.92rem">
        ওয়ামা তাওফীকী ইল্লা বিল্লাহ — আমার তাওফীক তো কেবল আল্লাহরই পক্ষ থেকে (হূদ ১১:৮৮)
      </p>
      ${nextNav(ROUTES[4], null)}`,
      after() {}
    };
  }

  /* ---------- রাউটার ---------- */
  const RENDERERS = {
    intro: renderIntro, streams: renderStreams, prophets: renderProphets,
    israel: renderIsrael, ulum: renderUlum, sources: renderSources
  };

  function currentHash() {
    const h = location.hash.replace(/^#\/?/, "");
    return RENDERERS[h] ? h : "intro";
  }

  function render() {
    const hash = currentHash();
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.route === hash));
    const { html, after } = RENDERERS[hash]();
    const container = main();
    container.innerHTML = `<div class="page">${html}</div>`;
    bindAccordions(container);
    if (after) after(container);
    window.scrollTo({ top: 0 });
    document.title = ROUTES.find(r => r.hash === hash).label + " — আল-কুরআন: এক নজরে";
  }

  /* ---------- থিম ---------- */
  function initTheme() {
    const saved = localStorage.getItem("qp-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefers ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    updateThemeBtn();
  }
  function updateThemeBtn() {
    const btn = $(".theme-toggle");
    if (btn) btn.textContent = document.documentElement.dataset.theme === "dark" ? "☀ দিন" : "☾ রাত";
  }

  /* ---------- বুট ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    const nav = $(".tabs-inner");
    nav.innerHTML = ROUTES.map(r =>
      `<a class="tab" data-route="${r.hash}" href="#/${r.hash}"><span class="t-ic">${r.ic}</span>${r.label}</a>`).join("");
    $(".theme-toggle").addEventListener("click", () => {
      const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = t;
      localStorage.setItem("qp-theme", t);
      updateThemeBtn();
    });
    window.addEventListener("hashchange", render);
    render();
  });
})();
