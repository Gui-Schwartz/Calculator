import { useState } from 'react'
import HandleOperations from './components/Handle-operations';
import ShowDisplay from './components/show-display';

import './App.css';


function App() {
  return (
    <div className="container">
      <div className="calculator-app-container"> 
        <HandleOperations />
      </div>
    </div>
  );
}
export default App;