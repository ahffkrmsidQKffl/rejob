import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Menubar } from '../components/Menubar';
import "./Help.css";

export const Help = () => {
  const helpImages = [
  "/도움말-1-1.png",
  "/도움말-1-2.png",
  "/도움말-1-3.png",
  "/도움말-2.png",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handlePrev = () => {
  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev < helpImages.length - 1) return prev + 1;
      // 마지막 인덱스에서 한 번 더 누르면 다음 페이지로 이동
      navigate("/enterinfo");
      return prev; // 상태는 유지
    });
  };

  return (
    <>
    <Menubar />
    <div className="Help-UI" data-model-id="86:6">
      <div className="div">
        <div className='nevigation-wrapper'>
        <div className="icon-wrapper" onClick={handlePrev}>
          <img
            className="img"
            alt="prev"
            src="https://c.animaapp.com/m58XXABM/img/icon-1.svg"
          />
        </div>
        <div className="overlap" 
        style={{
        backgroundImage: `url(${helpImages[currentIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        }}/>

        <div className="navigate-next" onClick={handleNext}>
          <img
            className="icon"
            alt="next"
            src="https://c.animaapp.com/m58XXABM/img/icon.svg"
          />
        </div>
        </div>

        
        <div className='ellipse-wrapper'>
        {helpImages.map((_, idx) => (
            <div
            key={idx}
            className={currentIndex === idx ? "ellipse-active" : "ellipse"}
            />
        ))}
        </div>
      </div>
    </div>
    </>
  );
};
