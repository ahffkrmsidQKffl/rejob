import { useState } from "react";
import "./Menubar.css";

export const Menubar = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div 
      className="menubar-div-wrapper" 
      data-model-id="117:55"
    >
      <div className="overlapper">
        <div className="overlap-group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
          <img
            className="logo"
            alt="Logo"
            src="https://c.animaapp.com/BkKVzIlT/img/logo.png"
          />

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

          <div className="overlap">
            <img
              className="line"
              alt="Line"
              src="https://c.animaapp.com/BkKVzIlT/img/line-20.png"
            />
          </div>

          <div className="image-wrapper">
            <img
              className="image-3"
              alt="Image"
              src="https://c.animaapp.com/BkKVzIlT/img/---.png"
            />
          </div>
        </div>

        <div className={`overlap-2 ${isHovering ? "show" : "hide"}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}>
          <div className="invisible-box" />
          <div className="sijackhagi">
          <div className="divforimage"> 
          <img
            className="image-4"
            alt="Image"
            src="https://c.animaapp.com/BkKVzIlT/img/----1.png"
          />
          </div>
          <div className="divforimage"> 
          <img
            className="image-5"
            alt="Image"
            src="https://c.animaapp.com/BkKVzIlT/img/----------.png"
          />
          </div>
          <div className="divforimage">
          <div className="invisible-box3" />
          </div>
          </div>
          <div className="illjarichaggi">
          <div className="divforimage">
          <img
            className="AI"
            alt="Ai"
            src="https://c.animaapp.com/BkKVzIlT/img/ai-------.png"
          />
          </div>
          <div className="divforimage">
          <img
            className="image-7"
            alt="Image"
            src="https://c.animaapp.com/BkKVzIlT/img/--------.png"
          />
          </div>
          <div className="divforimage">
          <img
            className="image-8"
            alt="Image"
            src="https://c.animaapp.com/BkKVzIlT/img/---------.png"
          />
          </div>
          </div>
          
        <div className="hwarewongaip">
          <div className="divforimage">
          <img
            className="image-6"
            alt="Image"
            src="https://c.animaapp.com/BkKVzIlT/img/-----2.png"
          />
          </div>
          <div className="divforimage">
          <div className="invisible-box4" />
          </div>
          <div className="divforimage">
          <div className="invisible-box5" />
          </div>
          </div>
          <div className="invisible-box2" />
        </div>
      </div>
    </div>
  );
};
