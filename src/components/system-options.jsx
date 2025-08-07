import React from "react";
import './system-menu.css';

const optionButtons = [
  { value: "basic", label: "Basic", selected: true },
  { value: "scientific", label: "Scientific" },
  { value: "notes", label: "Notes" }
];

const SystemButton = React.forwardRef(({ onSelect }, ref) => {
  return (
    <div className="menu-opcoes" ref={ref}>
      {optionButtons.map((btn) => (
        <button
          key={btn.value}
          className={btn.selected ? "selected" : ""}
          onClick={(e) => e.preventDefault()}
        >
          {btn.label}
        </button>
      ))}
      
      <div className="switch-container">
        <span>Conversion</span>
        <input type="checkbox" className="switch" disabled />
      </div>
    </div>
  );
});

export default SystemButton;