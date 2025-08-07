import React from "react";
import Buttons from "./Buttons";

import { formatDisplay } from "./Handle-operations"; // ou outro arquivo

const ShowDisplay = ({ expression }) => {
  if (typeof expression !== 'string') return <div className="display">0</div>;

  return (
    <div className="display" tabIndex={0}>
      {formatDisplay(expression) || 0}
      
    </div>
  );
};

export default ShowDisplay;