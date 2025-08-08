// src/components/Dropdown.jsx
import { useState, useRef, useEffect } from "react";

export default function Dropdown({ label, options, value, onChange, width=160 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
  return (
    <div className="dd" ref={ref} style={{ width }}>
      <button className="dd-btn" onClick={() => setOpen(o=>!o)}>
        {value || label}
        <span className="dd-caret">▾</span>
      </button>
      {open && (
        <ul className="dd-menu">
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
