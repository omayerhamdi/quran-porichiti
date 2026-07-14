/* কনটেন্টের সামঞ্জস্য-পরীক্ষা — কার্ড আর মানচিত্রের তথ্য যেন কখনো একে অন্যের সাথে না বাঁধে।
   চালাতে: tools/check.html ব্রাউজারে খুলুন (কোনো টুলচেইন লাগে না)। */

function runChecks(DATA) {
  const problems = [];
  const P = DATA.prophets;
  const all = P.eras.flatMap(e => e.prophets);
  const nodes = P.map.nodes.filter(n => n.n);
  const ids = new Set(P.map.nodes.map(n => n.id));

  /* ১. ২৫ জনই আছেন, ক্রম অটুট */
  if (all.length !== 25) problems.push(`নবীর সংখ্যা ২৫ নয়, পাওয়া গেল ${all.length}`);
  all.forEach((p, i) => {
    if (p.n !== i + 1) problems.push(`ক্রম ভেঙেছে: ${i + 1} নম্বরের জায়গায় ${p.n} (${p.name})`);
  });

  /* ২. কার্ড ↔ মানচিত্র: দুই দিক থেকেই মিল */
  all.forEach(p => {
    if (!nodes.find(n => n.n === p.n)) problems.push(`মানচিত্রে নেই: ${p.n} — ${p.name}`);
  });
  nodes.forEach(n => {
    const p = all.find(x => x.n === n.n);
    if (!p) { problems.push(`মানচিত্রের নোডের কার্ড নেই: ${n.n}`); return; }
    if (p.name !== n.name) problems.push(`নাম মেলে না #${n.n}: কার্ডে “${p.name}”, মানচিত্রে “${n.name}”`);

    const mapUlul = n.kind === "ulul" || n.kind === "final";
    if (!!p.ulul !== mapUlul) problems.push(`উলুল আযম অমিল #${n.n} ${p.name}: কার্ড=${!!p.ulul}, মানচিত্র=${mapUlul}`);

    if (!!p.ikhtilaf !== (n.kind === "dotted")) {
      problems.push(`মতভেদ-চিহ্ন অমিল #${n.n} ${p.name}: কার্ডে মতভেদ=${!!p.ikhtilaf}, মানচিত্রে kind=${n.kind}`);
    }
  });

  /* ৩. সংযোগরেখাগুলো বৈধ নোডে যাচ্ছে কি না */
  P.map.edges.forEach(e => {
    if (e.a && !ids.has(e.a)) problems.push(`অজানা edge.a: ${e.a}`);
    if (!ids.has(e.b)) problems.push(`অজানা edge.b: ${e.b}`);
  });

  /* ৪. উলুল আযম ঠিক পাঁচজন */
  const ulul = all.filter(p => p.ulul).map(p => p.name);
  if (ulul.length !== 5) problems.push(`উলুল আযম পাঁচজন হওয়ার কথা, পাওয়া গেল ${ulul.length}: ${ulul.join(", ")}`);

  /* ৫. আসমানি কিতাব চারটি */
  const books = all.filter(p => p.book).map(p => `${p.name} (${p.book})`);
  if (books.length !== 4) problems.push(`আসমানি কিতাব চারটি হওয়ার কথা, পাওয়া গেল ${books.length}: ${books.join(", ")}`);

  /* ৬. এক পাতার সংখ্যা আরেক পাতার দাবির সাথে মেলে কি না */
  const stat = k => DATA.intro.stats.find(s => s.label.includes(k));
  const mm = DATA.intro.makkiMadani;
  if (mm.makki + mm.madani !== 114) problems.push(`মাক্কী ${mm.makki} + মাদানী ${mm.madani} = ${mm.makki + mm.madani}, ১১৪ নয়`);
  if (stat("সূরা").num !== 114) problems.push("সূরার সংখ্যা ১১৪ নয়");
  if (stat("নবী").num !== all.length) problems.push(`সূচনায় নবী ${stat("নবী").num} জন, অথচ কার্ড আছে ${all.length}টি`);
  if (DATA.streams.list.length !== 5) problems.push(`ধারা পাঁচটি হওয়ার কথা, আছে ${DATA.streams.list.length}টি`);
  if (DATA.intro.themes.length !== 3) problems.push(`মৌলিক বিষয় তিনটি হওয়ার কথা, আছে ${DATA.intro.themes.length}টি`);
  if (DATA.israel.phases.length !== 6) problems.push(`বনী ইসরাঈলের পর্ব ছয়টি হওয়ার কথা, আছে ${DATA.israel.phases.length}টি`);

  /* ৭. কুইজের সঠিক উত্তর বৈধ অপশনের দিকে নির্দেশ করছে কি না */
  DATA.streams.quiz.questions.forEach((q, i) => {
    if (q.ans < 0 || q.ans >= DATA.streams.quiz.options.length) {
      problems.push(`কুইজের ${i + 1} নম্বর প্রশ্নের উত্তর-সূচক (${q.ans}) অপশনের বাইরে`);
    }
  });

  return {
    ok: problems.length === 0,
    problems,
    summary: `${all.length} জন নবী · ${DATA.streams.list.length}টি ধারা · ${DATA.israel.phases.length}টি পর্ব · উলুল আযম ${ulul.length} জন · কিতাব ${books.length}টি`
  };
}
