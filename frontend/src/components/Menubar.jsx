import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Menubar.css";

export const Menubar = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(true); // 🟡 임시 로그인 상태

  const navigate = useNavigate();

  const handleLoginToggle = () => {
    setIsLoggedIn(prev => !prev);
    //navigate("/"); // 원하는 경로로 이동 가능
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div 
      className="menubar-div-wrapper" 
      data-model-id="117:55"
    >
      <div className="overlapper">
        <div className="overlap-group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
          {/* 로고 */}
          <img
            className="logo"
            alt="Logo"
            src="https://c.animaapp.com/BkKVzIlT/img/logo.png"
          />
          {/* 시작하기 */}
          <img
          className="image"
          alt="Image"
          src={
            hoverIndex === 0
              ? "https://c.animaapp.com/BkKVzIlT/img/----.png"
              : "/시작하기.png"
          }
          onMouseEnter={() => setHoverIndex(0)}
          onMouseLeave={() => setHoverIndex(null)}
        />
          {/* 일자리 찾기 */}
          <img
          className="img"
          alt="Image"
          src={
            hoverIndex === 1
              ? "/일자리 찾기.png"
              : "https://c.animaapp.com/BkKVzIlT/img/------.png"
          }
          onMouseEnter={() => setHoverIndex(1)}
          onMouseLeave={() => setHoverIndex(null)}
          />
          {/* 로그인 여부에 따라 분기 */}
          {isLoggedIn ? (
            <>
              {/* 내 정보 */}
              <img
              className="image-2"
              alt="Image"
              src={
                hoverIndex === 2
                  ? "/내 정보 (2).png"
                  : "/내 정보 (3).png"
              }
              onMouseEnter={() => setHoverIndex(2)}
              onMouseLeave={() => setHoverIndex(null)}
              />
              {/* 로그아웃 버튼 */}
              <div className="image-wrapper" onClick={handleLoginToggle}>
                <img
                  className="image-3"
                  alt="Image"
                  src="/Group 18.png"
                />
              </div>
            </>
          ) : (
            <>
          {/* 가입하기 */}
          <img
          className="image-2"
          alt="Image"
          src={
            hoverIndex === 2
              ? "/가입하기.png"
              : "https://c.animaapp.com/BkKVzIlT/img/-----1.png"
          }
          onMouseEnter={() => setHoverIndex(2)}
          onMouseLeave={() => setHoverIndex(null)}
          />
          {/* 로그인 버튼 */}
          <div className="image-wrapper" onClick={handleLoginToggle}>
            <img
              className="image-3"
              alt="Image"
              src="https://c.animaapp.com/BkKVzIlT/img/---.png"
            />
          </div>
          </>
          )}
          <div className="overlap">
            <img
              className="line"
              alt="Line"
              src="https://c.animaapp.com/BkKVzIlT/img/line-20.png"
            />
          </div>

          
        </div>

        <div className={`overlap-2 ${isHovering ? "show" : "hide"}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
          <div className="invisible-box" />
          <div className="sijackhagi">
          <div className="divforimage" onClick={() => handleMenuClick("/help")}> 
          <img
            className="image-4"
            alt="도움말"
            src="https://c.animaapp.com/BkKVzIlT/img/----1.png"
          />
          </div>
          <div className="divforimage" onClick={() => handleMenuClick("/enterinfo")}> 
          <img
            className="image-5"
            alt="나에 대해 입력하기"
            src="https://c.animaapp.com/BkKVzIlT/img/----------.png"
          />
          </div>
          <div className="divforimage">
          <div className="invisible-box3" />
          </div>
          </div>
          <div className="illjarichaggi">
          <div className="divforimage" onClick={() => handleMenuClick("/input")}>
          <img
            className="AI"
            alt="Ai 이력서 생성"
            src="https://c.animaapp.com/BkKVzIlT/img/ai-------.png"
          />
          </div>
          <div className="divforimage" onClick={() => handleMenuClick("/recommend")}>
          <img
            className="image-7"
            alt="일자리 추천 받기"
            src="https://c.animaapp.com/BkKVzIlT/img/--------.png"
          />
          </div>
          <div className="divforimage" onClick={() => handleMenuClick("/joblist")}>
          <img
            className="image-8"
            alt="전체 일자리 목록"
            src="https://c.animaapp.com/BkKVzIlT/img/---------.png"
          />
          </div>
          </div>
          
        <div className="hwarewongaip">
          
          {isLoggedIn ? (
              <>
                <div className="divforimage" onClick={() => handleMenuClick("/mypage")}>
                  <img src="/마이페이지.png" alt="마이페이지" />
                </div>
                <div className="divforimage">
                <div className="invisible-box5" />
                </div>
                
                <div className="divforimage">
                <div className="invisible-box5" />
                </div>
              </>
            ) : (
              <>
          <div className="divforimage" onClick={() => handleMenuClick("/signup")}>
          <img
            className="image-6"
            alt="회원가입"
            src="https://c.animaapp.com/BkKVzIlT/img/-----2.png"
          />
          </div>
          <div className="divforimage">
          <div className="invisible-box4" />
          </div>
          <div className="divforimage">
          <div className="invisible-box5" />
          </div>
          </>
          )}
        </div>

          <div className="invisible-box2" />
        </div>
      </div>
    </div>
  );
};
