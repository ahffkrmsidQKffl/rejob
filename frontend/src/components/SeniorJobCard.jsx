import "../pages/Recommend.css"; // 기존 스타일 그대로 재사용

export default function SeniorJobCard({ job, onClick }) {
  return (
    <div className="overlap" key={job.id}>
      <div className="text-wrapper">{job.jobType}</div>
      <p className="p">
        <span className="single-line-ellipsis">
          사업체명 : {job.company}
        </span>
        접수기한 : {job.recruitPeriod}
        <br />
        직무요약 : {job.jobSummary}
      </p>
      <div className="overlap-5" onClick={onClick}>
        <div className="text-wrapper-5">자세히 보기</div>
      </div>
    </div>
  );
}
