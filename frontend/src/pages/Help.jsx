import { useState } from "react";
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

  const handlePrev = () => {
  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
  setCurrentIndex((prev) => (prev < helpImages.length - 1 ? prev + 1 : prev));
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
