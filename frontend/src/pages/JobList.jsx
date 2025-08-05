import { KeyboardArrowDown } from "../components/KeyboardArrowDown";
import { Menubar } from '../components/Menubar';
import { useState, useEffect } from "react";
import "./JobList.css";

export const JobList = () => {
  const [jobList, setJobList] = useState([]);
  useEffect(() => {
  // 나중에 백엔드/외부 API에서 받아오면 여기를 교체
  const dummyData = [
    {
      id: 1,
      title: "사회복지서비스업",
      company: "달나라시니어",
      period: "2025-07-22 ~ 2025-08-22",
    //   description: "직군 소개\n간단한 설명",
    },
    {
      id: 2,
      title: "직군명",
      company: "지구나라시니어",
      period: "2025-07-01 ~ 2025-08-31",
    },
    // ...
  ];
  setJobList(dummyData);
  }, []);
  return (
    <>
    <Menubar />
    <div className="JobList-UI" data-model-id="86:140">
      <div className="div">
        <div className="wrapperfor5and9">
        <div className="overlap-5">
          <div className="text-wrapper-10">어떤 일자리를 찾고 있나요?</div>
        </div>
        <div className="overlap-9">
          <div className="text-wrapper-13">검색</div>
        </div>
        </div>
        <div className="overlap-6">
          <div className="text-wrapper-11">조건 설정하기</div>

          <div className="overlap-7">
            <KeyboardArrowDown className="keyboard-arrow-down-instance" />
            <div className="rectangle" />

            <div className="text-wrapper-12">지역별</div>
          </div>

          <div className="overlap-8">
            <KeyboardArrowDown className="keyboard-arrow-down-instance" />
            <div className="rectangle" />

            <div className="text-wrapper-12">유형별</div>
          </div>
        </div>
        <div className="overlap-group-groupper">
            {jobList.map((job, idx) => (
                <div key={job.id} className="overlap-group">
                <div className="text-wrapper">
                    {job.title}
                </div>
                <p className="element">
                    기업체명 : {job.company}
                    <br />
                    접수기한 : {job.period}
                </p>
                {job.description && (
                    <div className="text-wrapper-14">
                    {job.description}
                    </div>
                )}
                <div className="overlap">
                    <div className="text-wrapper-2">자세히 보기</div>
                </div>
                </div>
            ))}
        </div>
      </div>
    </div>
    </>
  );
};
