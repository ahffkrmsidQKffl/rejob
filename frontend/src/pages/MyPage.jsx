
import { useEffect, useState } from 'react';
import Papa from "papaparse";
import JobCard from "../components/JobCard"; // Recommend에서 쓰는 카드
import { RecommendModal } from "../components/RecommendModal";
import { Menubar } from '../components/Menubar';
import "./MyPage.css";

export const MyPage = () => {
  const [selectedTab, setSelectedTab] = useState("개인정보");
  // 내 접수 이력 (노인일자리여기 / 사람인·고용24)
  const [appliedKorea, setAppliedKorea] = useState([]);
  const [appliedSenior, setAppliedSenior] = useState([]);

  // 모달
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (job) => { setSelectedJob(job); setIsModalOpen(true); };
  const closeModal = () => { setSelectedJob(null); setIsModalOpen(false); };
  
  useEffect(() => {
    // 1) 노인일자리여기 접수 이력
    fetch(`/applied_jobs_korea.csv`)
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true });
        const data = parsed.data
          .filter(row => row["기관"] || row["사업체명"])
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
            source: "노인일자리여기",
          }));
        setAppliedKorea(data);
      });

    // 2) 사람인·고용24 접수 이력
    fetch(`/applied_jobs_senior.csv`)
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true });
        const data = parsed.data
          .filter(row => row["title"] && row["company"])
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
        setAppliedSenior(data);
      });
  }, []);

  const formatDate = (str = "") => {
    const match = String(str).match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : str;
  };

  const handleDetailClick = (job) => openModal(job);

  return (
    <>
    <Menubar />
    <div className="MyPage-UI">
      <div className="div">
        <div className="divformypageleft">
        <div className={`overlap${selectedTab === "개인정보" ? "-group" : ""}`}
        onClick={() => setSelectedTab("개인정보")}
        style={{ cursor: "pointer" }}>
          <div className="text-wrapper">개인정보</div>
        </div>

        <div className={`overlap${selectedTab === "접수 내역 조회" ? "-group" : ""}`}
        onClick={() => setSelectedTab("접수 내역 조회")}
        style={{ cursor: "pointer" }}>
          <div className="text-wrapper-3">접수 내역 조회</div>
        </div>
        </div>

        <img
          className="line"
          alt="Line"
          src="https://c.animaapp.com/0HuAg3Zw/img/line-17.svg"
        />

        <div className="divformypageright">
        {selectedTab === "개인정보" && (
        <>
        <div className="overlap-4">
          <div className="group">
            <div className="overlap-group-2">
              <div className="rectangle" />

              <div className="text-wrapper-10">이름</div>
            </div>
          </div>

          <div className="text-wrapper-11">홍길동</div>
        </div>
        <div className="overlap-wrapper">
          <div className="overlap-5">
            <div className="rectangle-5" />

            <div className="text-wrapper-10">생년월일</div>

            <div className="text-wrapper-14">2000-10-10</div>
          </div>
        </div>

        <div className="group-2">
          <div className="text-wrapper-12">남성</div>

          <div className="text-wrapper-13">여성</div>

          <div className="text-wrapper-10">성별</div>

          <div className="rectangle-2" />

          <div className="rectangle-3" />
        </div>

        <div className="group-3">
          <div className="rectangle-4" />

          <div className="text-wrapper-10">경력 정보</div>
        </div>
        <div className="overlap-6">
          <div className="text-wrapper-15">수정하기</div>
        </div>
        </> )}
        {selectedTab === "접수 내역 조회" && (
          <>
            <div className='overlap-overlapper1'> {/* Recommend.css에 있는 grid 레이아웃 */}
              {appliedKorea.map(job => (
                <JobCard key={job.id} job={job} onDetail={handleDetailClick} />
              ))}
              {appliedSenior.map(job => (
                <JobCard key={job.id} job={job} onDetail={handleDetailClick} />
              ))}
            </div>  
          </>
        )}
        {isModalOpen && selectedJob && (
                  <div className="modal-overlay" onClick={closeModal}>
                    <div onClick={(e) => e.stopPropagation()}>
                      <RecommendModal job={selectedJob} onClose={closeModal} />
                    </div>
                  </div>
                )}
        </div>
      </div>
    </div>
    </>
  );
};
