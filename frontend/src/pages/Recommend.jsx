
import { Menubar } from '../components/Menubar';
import { useState, useEffect } from "react";
import "./Recommend.css";

export const Recommend = () => {
  const [seniorJobs, setSeniorJobs] = useState([]);
  const [publicJobs, setPublicJobs] = useState([]);

  useEffect(() => {
    // 지금은 임시 데이터
    const fakeSeniorJobs = [
      { id: 1, title: "사회복지서비스업", company: "달나라시니어", period: "2025-07-22 ~ 2025-08-22" },
      { id: 2, title: "사회복지서비스업", company: "별나라시니어", period: "2025-07-01 ~ 2025-08-31" },
      { id: 3, title: "직군명", company: "지구나라시니어", period: "2025-07-01 ~ 2025-08-31" },
      { id: 4, title: "직군명", company: "지구나라시니어", period: "2025-07-01 ~ 2025-08-31" },
      { id: 5, title: "직군명", company: "지구나라시니어", period: "2025-07-01 ~ 2025-08-31" },
    ];
    const fakePublicJobs = [
      { id: 1, title: "직군명", company: "사람인시니어", period: "2025-07-20 ~ 2025-08-25" },
      { id: 2, title: "사회복지서비스업", company: "고용24시니어", period: "2025-07-01 ~ 2025-08-30" },
      { id: 3, title: "사회복지서비스업", company: "고용24시니어", period: "2025-07-01 ~ 2025-08-30" },
      { id: 4, title: "사회복지서비스업", company: "고용24시니어", period: "2025-07-01 ~ 2025-08-30" },
    ];

    setSeniorJobs(fakeSeniorJobs);
    setPublicJobs(fakePublicJobs);
  }, []);

  const renderCard = (job) => (
    <div className="overlap" key={job.id}>
      <div className="text-wrapper">{job.title}</div>
      <p className="p">
        기업체명 : {job.company}
        <br />
        접수기한 : {job.period}
      </p>
      <div className="overlap-5">
        <div className="text-wrapper-5">자세히 보기</div>
      </div>
    </div>
  );

  const renderPublicCard = (job) => (
    <div className="overlap" key={job.id}>
      <div className="text-wrapper">{job.title}</div>
      <p className="p">
        기업체명 : {job.company}
        <br />
        접수기한 : {job.period}
      </p>
      <div className="div-wrapper">
        <div className="text-wrapper-2">자세히 보기</div>
      </div>
    </div>
  );

  return (
    <>
    <Menubar />
    <div className="Recommend-UI" data-model-id="86:84">
      <div className="div">
        <p className="text-wrapper-12">홍길동님과 딱 맞는 일자리를 찾았어요!</p>
        <div className="overlap-4">
          <div className="text-wrapper-4">노인일자리여기 공고</div>
          <div className='overlap-overlapper1'>
            {seniorJobs.map(renderCard)}
          {/* <div className="overlap">
            <div className="text-wrapper">사회복지서비스업</div>

            <p className="p">
              기업체명 : 달나라시니어
              <br />
              접수기한 : 2025-07-22 ~ 2025-08-22
            </p>

            <div className="overlap-5">
              <div className="text-wrapper-5">자세히 보기</div>
            </div>
          </div>
          <div className="overlap">
            <div className="text-wrapper">사회복지서비스업</div>

            <p className="p">
              기업체명 : 달나라시니어
              <br />
              접수기한 : 2025-07-22 ~ 2025-08-22
            </p>

            <div className="overlap-5">
              <div className="text-wrapper-5">자세히 보기</div>
            </div>
          </div>
          <div className="overlap">
            <div className="text-wrapper">사회복지서비스업</div>

            <p className="p">
              기업체명 : 달나라시니어
              <br />
              접수기한 : 2025-07-22 ~ 2025-08-22
            </p>

            <div className="overlap-5">
              <div className="text-wrapper-5">자세히 보기</div>
            </div>
          </div>
          <div className="overlap">
            <div className="text-wrapper">사회복지서비스업</div>

            <p className="p">
              기업체명 : 달나라시니어
              <br />
              접수기한 : 2025-07-22 ~ 2025-08-22
            </p>

            <div className="overlap-5">
              <div className="text-wrapper-5">자세히 보기</div>
            </div>
          </div>
          
          

          <div className="overlap">
            <div className="text-wrapper">사회복지서비스업</div>

            <p className="p">
              기업체명 : 별나라시니어
              <br />
              접수기한 : 2025-07-01 ~ 2025-08-31
            </p>

            <div className="overlap-5">
              <div className="text-wrapper-5">자세히 보기</div>
            </div>
          </div>

          <div className="overlap">
            <div className="text-wrapper">직군명</div>

            <p className="p">
              기업체명 : 지구나라시니어
              <br />
              접수기한 : 2025-07-01 ~ 2025-08-31
            </p>

            <div className="overlap-5">
              <div className="text-wrapper-5">자세히 보기</div>
            </div>
          </div> */}
          </div>
        </div>

        <div className="overlap-group">
          <div className="text-wrapper-4">사람인&amp;고용24 공고</div>
          <div className="overlap-overlapper2">
            {publicJobs.map(renderPublicCard)}
          {/* <div className='overlap'>
            <div className="text-wrapper">사회복지서비스업</div>

            <p className="p">
              기업체명 : 달나라시니어
              <br />
              접수기한 : 2025-07-22 ~ 2025-08-22
            </p>

            <div className="div-wrapper">
              <div className="text-wrapper-2">자세히 보기</div>
            </div>
          </div>

          <div className="overlap">
            <div className="text-wrapper">사회복지서비스업</div>

            <p className="p">
              기업체명 : 별나라시니어
              <br />
              접수기한 : 2025-07-01 ~ 2025-08-31
            </p>

            <div className="div-wrapper">
              <div className="text-wrapper-2">자세히 보기</div>
            </div>
          </div>

          <div className="overlap">
            <div className="text-wrapper">직군명</div>

            <p className="p">
              기업체명 : 지구나라시니어
              <br />
              접수기한 : 2025-07-01 ~ 2025-08-31
            </p>

            <div className="div-wrapper">
              <div className="text-wrapper-2">자세히 보기</div>
            </div>
          </div>
          <div className="overlap">
            <div className="text-wrapper">직군명</div>

            <p className="p">
              기업체명 : 지구나라시니어
              <br />
              접수기한 : 2025-07-01 ~ 2025-08-31
            </p>

            <div className="div-wrapper">
              <div className="text-wrapper-2">자세히 보기</div>
            </div>
          </div>
          <div className="overlap">
            <div className="text-wrapper">직군명</div>

            <p className="p">
              기업체명 : 지구나라시니어
              <br />
              접수기한 : 2025-07-01 ~ 2025-08-31
            </p>

            <div className="div-wrapper">
              <div className="text-wrapper-2">자세히 보기</div>
            </div>
          </div> */}

        </div>
        </div>
      </div>
    </div>
    </>
  );
};
