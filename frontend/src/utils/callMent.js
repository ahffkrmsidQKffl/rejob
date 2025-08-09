// utils/callMent.js
export function buildCallMent(job = {}, applicant = {}) {
  const 이름   = applicant.name   || "{이름}";
  const 나이   = applicant.age    || "{나이}";
  const 거주지 = applicant.region || "{거주지}";

  // 기관/직무/사업명 추출(빈 값 대비 순서대로 폴백)
  const 기관 = job.company || job.organization || "";
  const 직무 =
    job.jobType || job.jobSummary || parseBizFromDesc(job.jobDescription) || "해당 사업";

  const part1 = 기관 ? `${기관} ${직무}` : `${직무}`;
  return `안녕하세요. ${part1} 지원하려고 연락드렸습니다. 저는 ${거주지} 사는 ${나이}세 ${이름}입니다.`;
}

// 직무내용에서 '사업명/훈련명' 비슷한 토막 뽑기(없으면 null)
function parseBizFromDesc(desc = "") {
  const s = String(desc);
  const m1 = s.match(/(현장실습|훈련|지원|사업|프로그램)[^\n,]{0,20}/);
  if (m1) return m1[0].trim();
  return null;
}
