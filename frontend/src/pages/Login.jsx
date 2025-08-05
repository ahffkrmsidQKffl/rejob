import { Menubar } from '../components/Menubar';
import "./Login.css";

export const Login = () => {
  return (
    <>
    <Menubar />
    <div className="login-UI">
      <div className="div">
        
        <div className="text-wrapper-8">로그인</div>
        <div className="group">
          <div className="overlap-group">
            
            <div className="text-wrapper">아이디</div>
            <div className="rectangle" />

          </div>
        </div>

        <div className="overlap-wrapper">
          <div className="overlap-group">
            
            <div className="text-wrapper">비밀번호</div>
            <div className="rectangle" />

          </div>
        </div>
        <div className="overlap-2">
          <div className="rectangle-2">
            <div className="text-wrapper-9">로그인</div>
          </div>

          

          <div className="text-wrapper-10">비밀번호를 잊으셨나요?</div>
        </div>
      </div>
    </div>
    </>
  );
};
