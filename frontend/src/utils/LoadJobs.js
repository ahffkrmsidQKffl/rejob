// src/utils/loadJobs.js
import Papa from "papaparse";

const fetchCSV = async (path) =>
  new Promise((resolve, reject) => {
    Papa.parse(path, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: reject,
    });
  });

const extractRegion = (txt = "") => {
  const map = {
    "서울": "서울특별시",
    "부산": "부산광역시",
    "대구": "대구광역시",
    "인천": "인천광역시",
    "광주": "광주광역시",
    "대전": "대전광역시",
    "울산": "울산광역시",
    "세종": "세종특별자치시",
    "경기": "경기도",
    "강원": "강원특별자치도",
    "충북": "충청북도",
    "충남": "충청남도",
    "전북": "전라북도",
    "전남": "전라남도",
    "경북": "경상북도",
    "경남": "경상남도",
    "제주": "제주특별자치도",
  };

  const str = String(txt).trim();

  // 1. 전체 이름 매칭 (노인일자리여기 케이스)
  const fullMatch = Object.values(map).find(v => str.includes(v));
  if (fullMatch) return fullMatch;

  // 2. 앞글자 매칭 (사람인 케이스)
  const shortMatch = Object.keys(map).find(k => str.startsWith(k));
  if (shortMatch) return map[shortMatch];

  return "";
};

// 검색용 텍스트 만들기(객체 값 전부 합치기)
const makeSearchable = (obj) =>
  Object.values(obj)
    .filter((v) => typeof v === "string")
    .join(" ")
    .toLowerCase();

export const loadSeniorRaw = async (path = "/korea_jobs_fixed16_final.csv") => {
  const rows = await fetchCSV(path);
  return rows
    .filter(r => r["기관"])
    .map((row, index) => {
      const region =
        extractRegion(row["기관소재지"] || "");
      const job = {
        id: `noin-${index}`,
        source: "노인일자리여기",
        // 카드에 쓰일 대표 필드
        jobType: row["사업유형"] || "",
        title: row["직무요약"] || row["사업유형"] || "",
        company: row["사업체명"] || row["기관"] || "",
        period: row["모집기간"] || "",
        // 필터용
        region,
        // 상세
        organization: row["기관"] || "",
        orgAddress: row["기관소재지"] || "",
        jobSummary: row["직무요약"] || "",
        jobDescription: row["직무내용"] || "",
        plannedPeople: row["계획인원"] || "",
        joinedPeople: row["참여인원"] || "",
        workLocationDetail: row["근무지역(상세)"] || "",
        recruitPeopleDetail: row["모집인원(상세)"] || "",
        weeklyWorkTime: row["주근무시간"] || "",
        monthlyWorkTime: row["월근무시간"] || "",
        salary: row["임금액"] || "",
        recruitManager: row["구인담당자"] || "",
        contact: row["연락처"] || "",
      };
      return { ...job, searchable: makeSearchable(job) };
    });
};

export const loadPublicRaw = async (path = "/senior_jobs_fixed.csv") => {
  const rows = await fetchCSV(path);
  return rows
    .filter(r => r["title"] && r["company"])
    .map((row, index) => {
      const region = extractRegion(row["location"] || "");
      const job = {
        id: `saramin-${index}`,
        source: "사람인",
        // 카드 대표
        title: row["title"] || "직군명",
        company: row["company"] || "사람인시니어",
        period: `${String(row["posting"] || "").slice(0, 10)} ~ ${String(
          row["expiration"] || ""
        ).slice(0, 10)}`,
        // 필터용
        region,
        // 상세
        location: row["location"] || "",
        employment_type: row["employment_type"] || "",
        industry: row["industry"] || "",
        education: row["education"] || "",
        experience: row["experience"] || "",
        salary: row["salary"] || "",
        url: row["url"] || "",
      };
      return { ...job, searchable: makeSearchable(job) };
    });
};
