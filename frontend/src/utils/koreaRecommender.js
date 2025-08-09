// utils/koreaRecommender.js
import { regionScore, timeOverlap, keywordScore, constraintPenalty, wageScore, toInt, cosine } from "./recoCommon";

// csvRows: Papa.parse 결과(배열). user: 단일 입력 스키마
export function recommendKorea(csvRows, user, {jobEmbeddings=null, queryEmbedding=null, wRule=0.5, wSim=0.5}={}) {
  const prefsSet = new Set(Object.entries(user.availability||{}).filter(([k,v])=>v).map(([k])=>k));

  const rows = csvRows.filter(r => isActiveToday(r["모집기간"])); // 모집기간 유효(간단판)
  const scored = rows.map(r => {
    const txtAll = `${r["직무요약"]||""} ${r["직무내용"]||""}`;
    let s = 0;
    s += 30 * regionScore(`${r["기관소재지"]||""} ${r["근무지역(상세)"]||""}`, user.region?.sido, user.region?.gu);
    s += 20 * ((user.activityType && String(r["사업유형"]||"").includes(user.activityType)) ? 1 : 0.3);
    s += 15 * timeOverlap(String(r["주근무시간"]||""), prefsSet);
    s += 15 * keywordScore(txtAll, user.keywords||[]);
    // 잔여 TO
    const planned = toInt(r["계획인원"]), joined = toInt(r["참여인원"]);
    const leftTO = planned>0 ? Math.max(0, (planned - joined)/planned) : 0;
    s += 10 * leftTO;
    s += 10 * wageScore(r["임금액"], user.minWage);
    s -= 20 * constraintPenalty(txtAll, user.constraints||[]);
    const ruleRaw = s;

    // 정규화는 리스트 전체에서 하는 게 이상적이지만, 간단히 0~1 스케일 가정 (가중치만 맞추면 충분)
    const ruleScore = Math.max(0, Math.min(1, ruleRaw/100));

    // 임베딩 유사도(사전계산된 경우만)
    let simScore = 0;
    if (jobEmbeddings && queryEmbedding && jobEmbeddings[r.__idx__]) {
      const cos = cosine(jobEmbeddings[r.__idx__], queryEmbedding);
      simScore = (cos + 1)/2; // -1~1 → 0~1
    }

    const final = wRule*ruleScore + wSim*simScore;
    return {
      ...r,
      rule_score: Number(ruleScore.toFixed(6)),
      sim_score: Number(simScore.toFixed(6)),
      final_score: Number(final.toFixed(6)),
      추천근거: [
        `지역매칭 ${regionScore(`${r["기관소재지"]||""} ${r["근무지역(상세)"]||""}`, user.region?.sido, user.region?.gu).toFixed(2)}`,
        user.activityType ? `유형 ${String(r["사업유형"]||"").includes(user.activityType) ? "일치" : "부분"}` : null,
        prefsSet.size ? `시간대겹침 ${timeOverlap(String(r["주근무시간"]||""), prefsSet).toFixed(2)}` : null,
        (user.keywords||[]).length ? `키워드정합 ${keywordScore(txtAll, user.keywords).toFixed(2)}` : null,
        `잔여TO ${leftTO.toFixed(2)}`,
        user.minWage ? `임금충족 ${wageScore(r["임금액"], user.minWage).toFixed(2)}` : null,
        jobEmbeddings ? `유사도 ${simScore.toFixed(2)}` : null
      ].filter(Boolean).join(" · ")
    };
  });

  return scored.sort((a,b)=>b.final_score-a.final_score);
}

// 아주 단순한 모집기간 유효 체크
function isActiveToday(s) {
  if (!s) return true;
  const m = String(s).match(/(\d{4}-\d{2}-\d{2}).*(\d{4}-\d{2}-\d{2})/);
  if (!m) return true;
  const end = new Date(m[2]);
  const today = new Date();
  // 날짜만 비교
  end.setHours(0,0,0,0); today.setHours(0,0,0,0);
  return today <= end;
}
