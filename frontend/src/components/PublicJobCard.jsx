import "../pages/Recommend.css"; // 기존 스타일 그대로 재사용

export default function PublicJobCard({ job, onClick }) {
  const charCount = (job.employment_type || "").replace(/\s/g, "").length;
  const isLong = charCount > 10;

  return (
    <div className="overlap" key={job.id}>
      <div className={`text-wrapper ${isLong ? "small-text" : ""}`}>
        {job.employment_type}
      </div>
      <p className="p">
        <span className="single-line-ellipsis">
          사업체명 : {job.company}
        </span>
        <span className="single-line-ellipsis">
          접수기한 : {job.period}
        </span>
        <span className="single-line-ellipsis">
          직무요약 : {job.title}
        </span>
      </p>
      <div className="div-wrapper" onClick={onClick}>
        <div className="text-wrapper-2">자세히 보기</div>
      </div>
    </div>
  );
}