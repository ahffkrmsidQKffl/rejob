import JobCard from "../components/JobCard";
import { Menubar } from '../components/Menubar';
import Dropdown from "../components/Dropdown";
import { useState, useEffect, useMemo  } from "react";
import { loadSeniorRaw, loadPublicRaw } from "../utils/LoadJobs";
import "./JobList.css";

// 지역별, 유형별에 들어갈 단어들
const PROVINCES = [
  "전체",
  "서울특별시","부산광역시","대구광역시","인천광역시","광주광역시","대전광역시","울산광역시",
  "세종특별자치시","경기도","강원특별자치도","충청북도","충청남도","전라북도","전라남도",
  "경상북도","경상남도","제주특별자치도"
];
const TYPES = ["전체","노인일자리여기","사람인"];

export const JobList = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [query, setQuery] = useState("");
  // state
  const [region, setRegion] = useState("");     // ""=필터 없음
  const [typeCat, setTypeCat] = useState("");   // ""=필터 없음
  useEffect(() => {
    (async () => {
      const [noin, pub] = await Promise.all([
        loadSeniorRaw("/korea_jobs_fixed16_final.csv"),
        loadPublicRaw("/senior_jobs_fixed.csv"),
      ]);
      setAllJobs([...noin, ...pub]);
    })();
  }, []);
  
  const [committedQuery, setCommittedQuery] = useState(""); // 버튼 눌러 확정된 키워드

  const onSearchClick = () => setCommittedQuery(query.trim());

  // 필터 로직
  const filtered = useMemo(() => {
    const tokens = committedQuery.split(/\s+/).filter(Boolean).map(t=>t.toLowerCase());
    return allJobs.filter(j => {
      if (typeCat && typeCat !== "전체" && j.source !== typeCat) return false;
      if (region && region !== "전체" && j.region !== region) return false;
      if (!tokens.length) return true;
      // 하나라도 포함되면 통과 (OR)
      return tokens.some((t) => j.searchable.includes(t));
    });
  }, [allJobs, committedQuery, region, typeCat]);

  return (
    <>
    <Menubar />
    <div className="JobList-UI" data-model-id="86:140">
      <div className="div">
        <div className="wrapperfor5and9">
        <div className="overlap-55">
          <input
                className="text-wrapper-10"
                placeholder="어떤 일자리를 찾고 있나요?"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==='Enter') onSearchClick(); }}
                style={{ border: "none", outline: "none", width: "90%", background:"transparent"}}
              />
        </div>
        <div className="overlap-9" onClick={onSearchClick} style={{cursor:"pointer"}}>
          <div className="text-wrapper-13">검색</div>
        </div>
        </div>
        <div className="overlap-6">
          <div className="text-wrapper-11">조건 설정하기</div>
            <div className="filters-row">
              <Dropdown
                label="지역별"
                options={PROVINCES}
                value={region}
                onChange={setRegion}
                width={160}
              />
              <Dropdown
                label="유형별"
                options={TYPES}
                value={typeCat}
                onChange={setTypeCat}
                width={160}
              />
            </div>
          
        </div>

        <div className="overlap-group-groupper">
        {filtered.map(job => (
          <JobCard key={job.id} job={job} onDetail={(j) => console.log("자세히 보기", j)} />
        ))}
        </div>
      </div>
    </div>
    </>
  );
};
