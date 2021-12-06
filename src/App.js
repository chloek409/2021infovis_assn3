import React from "react";
import AxisView from './components/AxisView';
import "./App.css";


function App() {

  const width = 500;
  const height = 350;
  const margin = 35;
  const pointSize = 3;
  const maxPointSize = 10;

  return (
    <div className="App">
      <div>
        <AxisView />
      </div>
    </div>
  );
}

export default App;
