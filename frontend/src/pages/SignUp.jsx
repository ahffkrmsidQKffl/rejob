import { Menubar } from '../components/Menubar';
import "./SignUp.css";

export const SignUp = () => {
  return (
    <>
    <Menubar />
    <div className="UI">
    
      <div className='uidivwrapper'>
        
        <div className="text-wrapper-10">회원가입</div>
        <div className="group">
          
          <div className="overlap-group-2">
            <div className="rectangle" />

            <div className="text-wrapper-7">아이디</div>
          </div>
          <div className="overlap-3">
          <div className="rectangle-3">
            <div className="text-wrapper-8">중복 확인</div>
          </div>

          
        </div>
        </div>

        <div className="overlap-wrapper">
          <div className="overlap-2">
            <div className="rectangle-2" />

            <div className="text-wrapper-7">비밀번호</div>
          </div>
        </div>

        <div className="overlap-group-wrapper">
          <div className="overlap-2">
            <div className="rectangle-2" />

            <div className="text-wrapper-7">비밀번호 확인</div>
          </div>
        </div>

        

        <div className="div-wrapper">
          <div className="text-wrapper-9">가입하기</div>
        </div>

      </div>
    </div>
    
    </>
  );
};
