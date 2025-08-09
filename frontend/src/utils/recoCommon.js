// utils/recoCommon.js
export const toInt = (x) => {
  if (x == null) return 0;
  const s = String(x).replace(/[^\d]/g, "");
  return s ? parseInt(s, 10) : 0;
};

export const regionScore = (txt, sido, gu) => {
  const t = (txt || "");
  let s = 0;
  if (sido && t.includes(sido)) s += 0.6;
  if (gu && t.includes(gu)) s += 0.4;
  return Math.min(1, s);
};

const TIME_MAP = { "오전":"morning","오후":"afternoon","저녁":"evening","야간":"night","평일":"weekday","주말":"weekend",
  "월":"mon","화":"tue","수":"wed","목":"thu","금":"fri","토":"sat","일":"sun" };

export const timeOverlap = (jobTimeText, prefsSet) => {
  if (!jobTimeText || !prefsSet || prefsSet.size === 0) return 0;
  const found = Object.keys(TIME_MAP).filter(k => jobTimeText.includes(k)).map(k => TIME_MAP[k]);
  if (found.length === 0) return 0;
  const inter = found.filter(x => prefsSet.has(x)).length;
  return inter / found.length; // 0~1
};

export const keywordScore = (text, keywords=[]) => {
  if (!text || keywords.length === 0) return 0;
  const t = text.toLowerCase();
  const hit = keywords.filter(k => t.includes(String(k).toLowerCase())).length;
  return Math.min(1, hit / 5);
};

export const constraintPenalty = (text, constraints=[]) => {
  if (!text || constraints.length === 0) return 0;
  const t = text.toLowerCase();
  const hit = constraints.filter(k => t.includes(String(k).toLowerCase())).length;
  return Math.min(1, hit / 2); // 0~1
};

export const wageScore = (wageText, minWage) => {
  const min = toInt(minWage);
  if (!min) return 0.5;
  const w = toInt(wageText);
  if (!w) return 0;
  return w >= min ? 1 : 0.3;
};

// 코사인 유사도 (사전계산 임베딩 전제: 배열 길이 동일)
export const cosine = (a, b) => {
  let dot=0, na=0, nb=0;
  for (let i=0; i<a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
  const den = Math.sqrt(na)*Math.sqrt(nb);
  if (!den) return 0;
  return dot / den; // -1~1
};
