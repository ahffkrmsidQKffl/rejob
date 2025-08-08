// components/JobCard.jsx
export default function JobCard({ job, onDetail }) {
  const isSenior = job.source === "노인일자리여기";
  
  return (
    <div className="overlap" key={job.id}>
      <div className={`text-wrapper ${!isSenior && (job.employment_type || "").replace(/\s/g, "").length > 10 ? "small-text" : ""}`}>
        {job.jobType || job.employment_type || job.title}
      </div>
      <p className="p">
        <span className="single-line-ellipsis">
          사업체명 : {job.company}
        </span>
        <span className="single-line-ellipsis">
          접수기한 : {job.recruitPeriod || job.period}
        </span>
        <span className="single-line-ellipsis">
          직무요약 : {job.jobSummary || job.title}
        </span>
      </p>
      <div
        className={isSenior ? "overlap-5" : "div-wrapper"}
        onClick={() => onDetail(job)}
      >
        <div className={isSenior ? "text-wrapper-5" : "text-wrapper-2"}>
          자세히 보기
        </div>
      </div>
    </div>
  );
}
