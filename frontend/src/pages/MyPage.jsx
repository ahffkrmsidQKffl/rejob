
import { useState } from 'react';
import { Menubar } from '../components/Menubar';
import "./MyPage.css";
import "./MyPageResume.css";

export const MyPage = () => {
  const [selectedTab, setSelectedTab] = useState("개인정보");
  const dummyResumes = [
  {
    id: 1,
    position: "요양보호사",
    region: "서울특별시 강동구",
    createdAt: "2025-07-25",
    extra: "어르신 케어 경력 5년",
  },
  {
    id: 2,
    position: "청소 도우미",
    region: "서울특별시 송파구",
    createdAt: "2025-07-26",
    extra: "가사도우미 경험 2년",
  },
  {
    id: 3,
    position: "경비원",
    region: "서울특별시 노원구",
    createdAt: "2025-07-27",
    extra: "아파트 근무 3년",
  },
  {
    id: 4,
    position: "경비원",
    region: "서울특별시 노원구",
    createdAt: "2025-07-27",
    extra: "아파트 근무 3년",
  },
  ];
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
            <div className='MyPageResume-UI'>
            {dummyResumes.map((resume) => (
            <div key={resume.id} className="overlap-wrapper">
                <div className="overlap-group-2">
                <div className="text-wrapper-10">{resume.position}</div>
                <div className="text-wrapper-11">지역 : {resume.region}</div>
                <div className="text-wrapper-12">생성일자 : {resume.createdAt}</div>
                <div className="overlap-group-3">
                    <div className="text-wrapper-13">자세히 보기</div>
                </div>
                <div className="text-wrapper-14">{resume.extra}</div>
                </div>
            </div>
            ))}
            </div>
        )}
        </div>
      </div>
    </div>
    </>
  );
};
