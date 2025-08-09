
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from '../components/Menubar';
import "./EnterInfo.css";

export const EnterInfo = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 단일 입력 스키마 (공통 + 선택)
  // 최소 스키마 + 고급 접기 상태
  const [form, setForm] = useState({
    region: { sido: "", gu: "" },
    availability: {
      weekday: true, weekend: false,
      morning: true, afternoon: false, evening: false, night: false,
    },
    keywords: "",
    freeText: "",

    // 고급(선택)
    minWage: "",
    activityType: "",
    employmentType: "",
    industryPref: "",
    maxEducation: "",
    experienceYears: "",
    startImmediate: false,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const onChange = (path, value) => {
    setForm(prev => {
      const next = structuredClone(prev);
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = value;
      return next;
    });
  };

  const toArray = (s) => (s || "").split(",").map(v => v.trim()).filter(Boolean);

  const buildUserInput = () => {
    return {
      region: {
        sido: form.region.sido?.trim() || null,
        gu: form.region.gu?.trim() || null,
      },
      availability: form.availability,
      keywords: toArray(form.keywords),
      freeText: form.freeText?.trim() || null,

      // 고급(비어있으면 null → 서버에서 자동 무시)
      minWage: Number(String(form.minWage).replace(/[^\d]/g, "")) || null,
      activityType: form.activityType || null,
      employmentType: form.employmentType || null,
      industryPref: toArray(form.industryPref),
      maxEducation: form.maxEducation || null,
      experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
      startImmediate: !!form.startImmediate,
    };
  };

  const handleSubmit = async () => {
    const userInput = buildUserInput();
    localStorage.setItem("userInput", JSON.stringify(userInput));
    try {
        // ✅ 병렬 호출 (아래 2)에서 설명)
        await Promise.all([
          fetch("http://localhost:5001/recommend/korea", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userInput),
          }),
          fetch("http://localhost:5001/recommend/senior", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userInput),
          }),
        ]);

        navigate("/recommend");
      } catch (e) {
        alert("추천 준비 중 오류가 발생했습니다. 서버 상태를 확인해 주세요.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

  const Toggle = ({label, checked, onChange}) => (
    <button
      type="button"
      className={`pill ${checked ? "pill-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      {label}
    </button>
  );

  return (
    <>
    <Menubar />
    <div className="EnterInfo-UI" data-model-id="86:38">
      <div className="div">
        <div className="overlap">
        <div className="top-wrapper">
          <div className="logo">
            <img className="img" alt="Logo" src="https://c.animaapp.com/BkKVzIlT/img/logo.png" />
          </div>
          <div className="text-wrapper-5">나에 대해 입력하기</div>
        </div>

        {/* 지역 */}
            <section className="card">
              <h3 className="card-title">어디에서 일하고 싶나요?</h3>
              <div className="row">
                <input
                  className="input"
                  placeholder="시/도 (예: 서울특별시)"
                  value={form.region.sido}
                  onChange={(e) => onChange(["region","sido"], e.target.value)}
                />
                <input
                  className="input"
                  placeholder="구/군 (예: 영등포구)"
                  value={form.region.gu}
                  onChange={(e) => onChange(["region","gu"], e.target.value)}
                />
              </div>
            </section>

            {/* 가능 시간 */}
            <section className="card">
              <h3 className="card-title">가능한 요일/시간을 알려주세요</h3>
              <div className="row wrap">
                <Toggle label="평일" checked={form.availability.weekday}
                        onChange={(v)=>onChange(["availability","weekday"], v)} />
                <Toggle label="주말" checked={form.availability.weekend}
                        onChange={(v)=>onChange(["availability","weekend"], v)} />
                <Toggle label="오전" checked={form.availability.morning}
                        onChange={(v)=>onChange(["availability","morning"], v)} />
                <Toggle label="오후" checked={form.availability.afternoon}
                        onChange={(v)=>onChange(["availability","afternoon"], v)} />
                <Toggle label="저녁" checked={form.availability.evening}
                        onChange={(v)=>onChange(["availability","evening"], v)} />
                <Toggle label="야간" checked={form.availability.night}
                        onChange={(v)=>onChange(["availability","night"], v)} />
              </div>
            </section>

            {/* 키워드 & 자유서술 */}
            <section className="card">
              <h3 className="card-title">관심 키워드</h3>
              <input
                className="input"
                placeholder="쉼표로 구분 (예: 안내,사무,청소)"
                value={form.keywords}
                onChange={(e)=>setForm({...form, keywords:e.target.value})}
              />
              <h3 className="card-title" style={{marginTop: 16}}>추가 설명(선택)</h3>
              <textarea
                className="textarea"
                placeholder="예: 실내 사무보조 위주로 조용한 환경 선호"
                value={form.freeText}
                onChange={(e)=>setForm({...form, freeText:e.target.value})}
              />
            </section>

          {/* 고급 옵션 토글 */}
            <button type="button" className="accordion" onClick={()=>setShowAdvanced(v=>!v)}>
              고급 옵션 {showAdvanced ? "숨기기" : "펼치기"}
            </button>

            {showAdvanced && (
              <section className="card">
                <div className="row">
                  <div className="field">
                    <label>최소 임금(선택)</label>
                    <input
                      className="input"
                      placeholder="숫자만 (예: 290000)"
                      value={form.minWage}
                      onChange={(e)=>setForm({...form, minWage:e.target.value})}
                    />
                  </div>
                  <div className="field">
                    <label>활동 유형(공공)</label>
                    <select
                      className="input"
                      value={form.activityType}
                      onChange={(e)=>setForm({...form, activityType:e.target.value})}
                    >
                      <option value="">선택 안 함</option>
                      <option value="노인공익활동사업">노인공익활동사업</option>
                      <option value="사회서비스형">사회서비스형</option>
                      <option value="민간">민간</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="field">
                    <label>고용형태(채용)</label>
                    <select
                      className="input"
                      value={form.employmentType}
                      onChange={(e)=>setForm({...form, employmentType:e.target.value})}
                    >
                      <option value="">선택 안 함</option>
                      <option value="정규직">정규직</option>
                      <option value="계약">계약</option>
                      <option value="파트">파트</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>선호 산업(쉼표)</label>
                    <input
                      className="input"
                      placeholder="예: 복지,요양,시설관리"
                      value={form.industryPref}
                      onChange={(e)=>setForm({...form, industryPref:e.target.value})}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="field">
                    <label>최대 학력</label>
                    <select
                      className="input"
                      value={form.maxEducation}
                      onChange={(e)=>setForm({...form, maxEducation:e.target.value})}
                    >
                      <option value="">선택 안 함</option>
                      <option value="중졸">중졸</option>
                      <option value="고졸">고졸</option>
                      <option value="전문학사">전문학사</option>
                      <option value="학사">학사</option>
                      <option value="석사">석사</option>
                      <option value="박사">박사</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>총 경력(년)</label>
                    <input
                      className="input"
                      placeholder="예: 0, 1, 3"
                      value={form.experienceYears}
                      onChange={(e)=>setForm({...form, experienceYears:e.target.value})}
                    />
                  </div>
                </div>

                <label className="inline">
                  <input
                    type="checkbox"
                    checked={form.startImmediate}
                    onChange={(e)=>setForm({...form, startImmediate:e.target.checked})}
                  />
                  즉시 시작 가능
                </label>
              </section>
            )}

          <button
            className="overlap-group"
            onClick={handleSubmit}
            disabled={loading}
            aria-busy={loading}
          >
            <div className="text-wrapper">
              {loading ? "추천 중..." : "일자리 추천받기"}
            </div>
          </button>
        </div>
      </div>
    </div>
    </>
  );
};
