import React from "react";
import './system-menu.css';

const optionButtons = [
  { value: "basic", label: "Básica", selected: true },
  { value: "scientific", label: "Científica" },
  { value: "notes", label: "Notas de Cálculo" }
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
        <span>Conversão</span>
        <input type="checkbox" className="switch" disabled />
      </div>
    </div>
  );
});

export default SystemButton;
