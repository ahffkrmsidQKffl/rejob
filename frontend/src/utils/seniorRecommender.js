// utils/seniorRecommender.js
import { regionScore, timeOverlap, keywordScore, constraintPenalty, wageScore, cosine } from "./recoCommon";

export function recommendSenior(csvRows, user, {jobEmbeddings=null, queryEmbedding=null, wRule=0.5, wSim=0.5}={}) {
  const prefsSet = new Set(Object.entries(user.availability||{}).filter(([k,v])=>v).map(([k])=>k));

  // 마감 유효
  const rows = csvRows.filter(r => isOpen(r.expiration));
  const scored = rows.map((r, idx) => {
    const textAll = `${r.title||""} ${r.keyword||""}`; // senior는 title/keyword 중심
    let s = 0;
    s += 30 * regionScore(r.location, user.region?.sido, user.region?.gu);
    s += 20 * ((user.employmentType && String(r.employment_type||"").includes(user.employmentType)) ? 1 : 0.3);
    s += 15 * timeOverlap(String(r.work_hours||""), prefsSet); // 없다면 0
    s += 15 * keywordScore(textAll, user.keywords||[]);
    s += 10 * wageScore(r.salary, user.minWage);
    s -= 20 * constraintPenalty(textAll, user.constraints||[]);
    // (선택) industry/education/experience/최신성 가점은 추가로 더 가능
    const ruleScore = Math.max(0, Math.min(1, s/100));

    let simScore = 0;
    if (jobEmbeddings && queryEmbedding && jobEmbeddings[idx]) {
      const cos = cosine(jobEmbeddings[idx], queryEmbedding);
      simScore = (cos + 1)/2;
    }

    const final = wRule*ruleScore + wSim*simScore;
    return {
      ...r,
      rule_score: Number(ruleScore.toFixed(6)),
      sim_score: Number(simScore.toFixed(6)),
      final_score: Number(final.toFixed(6)),
      추천근거: [
        `지역매칭 ${regionScore(r.location, user.region?.sido, user.region?.gu).toFixed(2)}`,
        user.employmentType ? `고용형태 ${String(r.employment_type||"").includes(user.employmentType) ? "일치" : "부분"}` : null,
        prefsSet.size ? `시간대겹침 ${timeOverlap(String(r.work_hours||""), prefsSet).toFixed(2)}` : null,
        (user.keywords||[]).length ? `키워드정합 ${keywordScore(textAll, user.keywords).toFixed(2)}` : null,
        jobEmbeddings ? `유사도 ${simScore.toFixed(2)}` : null
      ].filter(Boolean).join(" · ")
    };
  });

  return scored.sort((a,b)=>b.final_score-a.final_score);
}

function isOpen(exp) {
  if (!exp) return true;
  // ISO string or yyyy-mm-dd…
  const end = new Date(String(exp).replace("Z","+00:00"));
  if (isNaN(end)) return true;
  const today = new Date();
  end.setHours(0,0,0,0); today.setHours(0,0,0,0);
  return today <= end;
}
