import React from 'react';
import ChessGame from './ChessGame';
import { Analytics } from "@vercel/analytics/react"
import './Appcss.css';

function App() {
  return (
    <div className="App">
      <ChessGame />
    </div>
  );
}

export default App;
