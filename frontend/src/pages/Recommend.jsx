
import { RecommendModal } from "../components/RecommendModal";
import { Menubar } from '../components/Menubar';
import { useState, useEffect } from "react";
import Papa from "papaparse";
import JobCard from "../components/JobCard";
import "./Recommend.css";

export const Recommend = () => {
  const [seniorJobs, setSeniorJobs] = useState([]);
  const [publicJobs, setPublicJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
  // 노인일자리여기
  fetch(`/korea_jobs_fixed16_recommended.csv`)
    .then((res) => res.text())
    .then((text) => {
      const parsed = Papa.parse(text, { header: true });
      console.log("🟡 CSV 파싱 결과:", parsed.data);  // 👈 이 줄 추가
      const seniorData = parsed.data
      .filter(row => row["기관"]) // ⬅️ 유효한 행만 통과
      .map((row, index) => ({
        id: index,
        organization: row["기관"] || "",
        company: row["사업체명"] || "",
        orgAddress: row["기관소재지"] || "",
        jobSummary: row["직무요약"] || "",
        jobType: row["사업유형"] || "",
        plannedPeople: row["계획인원"] || "",
        joinedPeople: row["참여인원"] || "",
        recruitPeriod: row["모집기간"] || "",
        workLocationDetail: row["근무지역(상세)"] || "",
        jobDescription: row["직무내용"] || "",
        recruitPeopleDetail: row["모집인원(상세)"] || "",
        weeklyWorkTime: row["주근무시간"] || "",
        monthlyWorkTime: row["월근무시간"] || "",
        salary: row["임금액"] || "",
        recruitManager: row["구인담당자"] || "",
        contact: row["연락처"] || "",
        source: "노인일자리여기"
      }));
      console.log("🟢 최종 가공 데이터:", seniorData);  // 👈 이 줄 추가
      setSeniorJobs(seniorData);
    });
  // 사람인
  fetch(`/senior_jobs_fixed_recommended.csv`)
    .then((res) => res.text())
    .then((text) => {
      const parsed = Papa.parse(text, { header: true });
      const publicData = parsed.data
      .filter(row => row["title"] && row["company"]) // ⬅️ 필터 추가
      .map((row, index) => ({
        id: index,
        title: row["title"] || "직군명",
        company: row["company"] || "사람인시니어",
        location: row["location"] || "",
        employment_type: row["employment_type"] || "", 
        industry: row["industry"] || "",
        education: row["education"] || "",
        experience: row["experience"] || "",
        salary: row["salary"] || "",
        period: `${formatDate(row["posting"])} ~ ${formatDate(row["expiration"])}`,
        url: row["url"] || "",
        source: "사람인",
      }));
      setPublicJobs(publicData);
    });
  }, []);

  const handleDetailClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  const formatDate = (str = "") => {
    const match = String(str).match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : str; // 매칭되면 YYYY-MM-DD만 반환
  };

  return (
    <>
    <Menubar />
    <div className="Recommend-UI" data-model-id="86:84">
      <div className="div">
        <p className="text-wrapper-12">홍길동님과 딱 맞는 일자리를 찾았어요!</p>
        <div className="overlap-4">
          <div className="text-wrapper-4">노인일자리여기 공고</div>
          <div className='overlap-overlapper1'>
            {seniorJobs.map(job => (
              <JobCard key={job.id} job={job} onDetail={handleDetailClick} />
            ))}
          </div>
        </div>

        <div className="overlap-group">
          <div className="text-wrapper-4">사람인&amp;고용24 공고</div>
          <div className="overlap-overlapper2">
            {publicJobs.map(job => (
              <JobCard key={job.id} job={job} onDetail={handleDetailClick} />
            ))}
        </div>
        </div>
        {isModalOpen && selectedJob && (
          <div className="modal-overlay" onClick={closeModal}>
            <div onClick={(e) => e.stopPropagation()}>
              <RecommendModal job={selectedJob} onClose={closeModal} />
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};
