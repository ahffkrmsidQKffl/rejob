
import "./EnterInfo.css";

export const EnterInfo = () => {
  return (
    <div className="EnterInfo-UI" data-model-id="86:38">
      <div className="div">
        <div className="overlap">
        <div className="top-wrapper">
            <div className="logo">
          {/* <p className="AI">
            <span className="span">다</span>

            <span className="text-wrapper-9">
              AI,
              <br />
              일자리
            </span>
          </p> */}
          <img
            className="img"
            alt="Logo"
            src="https://c.animaapp.com/BkKVzIlT/img/logo.png"
          />
        </div>
          <div className="text-wrapper-5">나에 대해 입력하기</div>
          </div>
          <div className="group">
            <div className="overlap-group-2">
                
              <div className="text-wrapper-2">이름</div>
              <div className="rectangle" />

            </div>
          </div>
          <div className="group-4">
            <div className="text-wrapper-2">생년월일</div>
            <div className="birthdayrapping">
                <div className="overlap-3">
              <div className="rectangle-6"> 
                <div className="text-wrapper-6">연도(4자)</div>
              </div>
            </div>
            <div className="overlap-4">
              <div className="rectangle-5"><div className="text-wrapper-6">월</div></div>
            </div>
            <div className="overlap-2">
              <div className="rectangle-5"><div className="text-wrapper-6">일</div></div>
            </div>

            

            
            </div>
          </div>
          <div className="group-2">
            <div className="text-wrapper-2">성별</div>
            <div className="genderrapping">
            <div className="rectangle-2" />
            <div className="text-wrapper-3">남성</div>
            <div className="rectangle-2" />
            <div className="text-wrapper-4">여성</div>
            </div>
          </div>
          <div className="group-3">
            <div className="text-wrapper-2">경력 정보</div>

            <div className="rectangle-4" />
            <p className="p">
              ※ 입력하신 정보는 이력서 자동 작성에만 사용됩니다.
              <br />
              안심하고 입력해 주세요.
            </p>
          </div>
          <div className="overlap-group">
            <div className="text-wrapper">일자리 추천받기</div>
          </div>
        </div>
      </div>
    </div>
  );
};
