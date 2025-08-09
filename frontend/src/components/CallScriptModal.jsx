// src/components/CallScriptModal.jsx
import { buildCallMent } from "../utils/callMent";
import { useEffect } from "react";
import "./RecommendModal.css"; // 재사용

function pickInfo(job = {}) {
  const phone = job.contact || "";
  const org   = job.company || job.organization || "";
  const name  = job.recruitManager || "채용 담당자";
  const role  = job.jobType || job.jobSummary || "";
  const hours = job.weeklyWorkTime || job.monthlyWorkTime || "";
  const wage  = job.salary || "";
  const loc   = job.workLocationDetail || job.location || "";
  const period= job.recruitPeriod || job.period || "";
  return { phone, org, name, role, hours, wage, loc, period };
}

function normalizeTel(t="") {
  return String(t).replace(/[^\d+]/g, ""); // 숫자/+만
}

export default function CallScriptModal({ job, onClose }) {
  // ESC 닫기
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const applicant = JSON.parse(localStorage.getItem("applicant") || "{}");
  const ment = buildCallMent(job, applicant);
  const info = pickInfo(job);
  const tel  = normalizeTel(info.phone);
  
  // const copyAll = async () => {
  //   await navigator.clipboard.writeText(oneLine);
  //   alert("한 줄 멘트를 복사했어요.");
  // };

  // const printView = () => window.print();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="RecommendModal-box" onClick={(e)=>e.stopPropagation()}>
        <div className="cs-modal">
          <button className="cs-close" onClick={onClose} aria-label="닫기">×</button>

          <header className="cs-header">
            <h2>전화 멘트</h2>
          </header>
          <hr className="cs-sep" />

          {/* 멘트 카드 */}
          <section className="cs-ment">
            <p className="cs-ment-text">{ment}</p>
            <p className="cs-ment-hint">* 그대로 읽으시면 됩니다.</p>
          </section>

          {/* 정보 카드 */}
          <section className="cs-info">
            <div className="cs-row">
              <span className="cs-label">전화번호</span>
              <span className="cs-value">
                {info.phone ? (
                  <>
                    <a className="cs-link" href={`tel:${tel}`}>{info.phone}</a>
                    <button className="btn btn-ghost btn-xs"
                      onClick={()=>navigator.clipboard.writeText(info.phone)}>
                      번호 복사
                    </button>
                  </>
                ) : "미기재"}
              </span>
            </div>
            <div className="cs-row">
              <span className="cs-label">담당자</span>
              <span className="cs-value">{info.name}</span>
            </div>
            <div className="cs-row">
              <span className="cs-label">직무</span>
              <span className="cs-value">{info.role || "-"}</span>
            </div>
            <div className="cs-row">
              <span className="cs-label">사업체명</span>
              <span className="cs-value">{info.org}</span>
            </div>
            <div className="cs-row">
              <span className="cs-label">근무시간</span>
              <span className="cs-value">{info.hours || "-"}</span>
            </div>
            <div className="cs-row">
              <span className="cs-label">임금</span>
              <span className="cs-value">{info.wage || "-"}</span>
            </div>
            <div className="cs-row">
              <span className="cs-label">근무지</span>
              <span className="cs-value">{info.loc || "-"}</span>
            </div>
            <div className="cs-row">
              <span className="cs-label">모집기간</span>
              <span className="cs-value">{info.period || "-"}</span>
            </div>
          </section>

          {/* 액션 */}
          <footer className="cs-actions">
            <button className="btn btn-primary" onClick={()=>{
              navigator.clipboard.writeText(ment);
              alert("한 줄 멘트를 복사했어요.");
            }}>복사하기</button>
            <button className="btn btn-outline" onClick={()=>window.print()}>
              인쇄/PDF 저장
            </button>
          </footer>
        </div>
        {/* <div className="RecommendModal-overlap-group" style={{paddingBottom: 24}}>
          <img className="RecommendModal-x-instance" src="https://c.animaapp.com/lqLnLp8L/img/x.svg" onClick={onClose}/>
          <div className="RecommendModal-text-wrapper-1-5">
            <div className="RecommendModal-text-wrapper-2">전화 멘트</div>
            <div className="RecommendModal-text-wrapper-2-5">{job?.company || job?.organization || ""}</div>
          </div>
          <img className="RecommendModal-line" alt="Line" src="https://c.animaapp.com/lqLnLp8L/img/line-35.svg"/>
          
          <div className="RecommendModal-groupunderline callscript-scroll" style={{width: '80%'}}>
            <div style={{fontSize: 26, lineHeight: "38px", fontWeight: 700}}>
              {oneLine}
            </div>
            <div style={{marginTop: 10, fontSize: 16, opacity: 0.7}}>
              * 그대로 읽으시면 됩니다.
            </div>
          </div>
          
          <div className="RecommendModal-groupunderline" style={{ width:'80%', marginTop: 4 }}>
            <p className="RecommendModal-p" style={{fontSize: 18, lineHeight: "30px"}}>
              <b>전화번호:</b> {info.phone ? (
                <>
                  <a href={`tel:${tel}`} style={{textDecoration:"underline"}}>{info.phone}</a>
                  <button
                    onClick={() => navigator.clipboard.writeText(info.phone)}
                    style={{marginLeft:8, fontSize:14, padding:"2px 8px", borderRadius:8, border:"1px solid #ddd", cursor:"pointer"}}
                  >번호 복사</button>
                </>
              ) : "미기재"}
              <br/>
              <b>담당자:</b> {info.name}<br/>
              <b>직무:</b> {info.role || "-"} / <b>근무시간:</b> {info.hours || "-"} / <b>임금:</b> {info.wage || "-"}<br/>
              <b>근무지:</b> {info.loc || "-"} / <b>모집기간:</b> {info.period || "-"}
            </p>
          </div>
          <div className="RecommendModal-overlap noin" style={{gap: 16, height: 'auto', padding: 16, flexDirection: "column"}}>
            <div className="RecommendModal-div" onClick={copyAll}>복사하기</div>
            <div className="RecommendModal-div" onClick={printView}>인쇄/PDF 저장</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
