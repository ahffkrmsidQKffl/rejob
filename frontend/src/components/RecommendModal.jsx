import { useState } from "react";
import "./RecommendModal.css";

export const RecommendModal = ({job, onClose}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(prev => !prev);
  // 1) source별 표준화
  const view = (() => {
    switch (job.source) {
      case "노인일자리여기":
        return {
          title: job.jobType,                     // 상단 큰 제목
          company: job.company,
          location: job.workLocationDetail,
          period: job.recruitPeriod,
          phone: job.contact,
          desc: job.jobDescription,
          ctaText: "전화 스크립트 생성하기",
          ctaClass: "noin",
          onCta: () => { /* 전화 스크립트 모달 열기 등 */ }
        };
      case "사람인":
        return {
          title: job.employment_type,
          company: job.company,
          location: job.location,
          period: job.period,
          phone: "아래 '공고로 이동하기'를 클릭해주세요",       
          desc: job.title,         
          ctaText: "공고로 이동하기",
          ctaClass: "",
          onCta: () => window.open(job.url, "_blank")
        };
      // 필요하면 다른 소스 계속 추가
      default:
        return {
          title: job.jobType || job.title || "",
          company: job.company || job.organization || "",
          location: job.workLocationDetail || job.location || "",
          period: job.recruitPeriod || job.period || "",
          phone: job.contact || "",
          desc: job.jobDescription || job.jobSummary || "",
          ctaText: "자세히 보기",
          ctaClass: "",
          onCta: () => {}
        };
    }
  })();
  if (!job) return null;
  return (
    <div className="RecommendModal-box" data-model-id="406:24-frame">
      <div className="RecommendModal-group">
        <div className="RecommendModal-overlap-group">
          <img className="RecommendModal-x-instance" 
          src="https://c.animaapp.com/lqLnLp8L/img/x.svg" 
          onClick={onClose}/>
          <div className="RecommendModal-text-wrapper-1-5">
          <div className="RecommendModal-text-wrapper-2">{view.title}</div>
          <div className="RecommendModal-text-wrapper-2-5">{view.company}</div>
          </div>
          <img
            className="RecommendModal-line"
            alt="Line"
            src="https://c.animaapp.com/lqLnLp8L/img/line-35.svg"
          />
          <div className="RecommendModal-groupunderline">
            <div className="RecommendModal-groupoflcp">
            <img
                className="RecommendModal-location-on-instance"
                src="https://c.animaapp.com/lqLnLp8L/img/location-on-1.svg"
            />
            <div className="RecommendModal-p">근무지역 : {view.location || "정보 없음"}</div>
            </div>
            <div className="RecommendModal-groupoflcp">
            <img
                className="RecommendModal-calendar-instance"
                src="https://c.animaapp.com/lqLnLp8L/img/calendar.svg"
                size="forty-eight"
            />
            <div className="RecommendModal-p">접수기한 : {view.period || "정보 없음"}</div>
            </div>
            <div className="RecommendModal-groupoflcp">
            <img
                className="RecommendModal-phone-call-instance"
                src="https://c.animaapp.com/lqLnLp8L/img/phone-call.svg"
                size="forty-eight"
            />
            <div className="RecommendModal-p">전화번호 : {view.phone || "없음"}</div>
            </div>
            <div className="RecommendModal-groupoflcp">
            <img
            className="RecommendModal-work-detail-instance"
            src="/Align justify.png"
            size="forty-eight"
            />
            <div className="RecommendModal-p-jikmoo">직무내용</div>
            <div className={`job-description-box ${expanded ? "expanded" : ""}`}>
              {view.desc || "정보 없음"}
            </div>
            <button className="expand-btn" onClick={toggleExpanded}>
              {expanded ? "간략히 보기" : "자세히 보기"}
            </button>
            </div>
            {/* <div className="RecommendModal-text-wrapper">세부 설명</div> */}
          </div>
          <div className={`RecommendModal-overlap ${view.ctaClass}`} onClick={view.onCta}> 
            <div className="RecommendModal-div">{view.ctaText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
