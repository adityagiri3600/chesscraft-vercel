import React from 'react';
import ReactDOM from 'react-dom/client';
import './indexcss.css';
import { Analytics } from "@vercel/analytics/react"
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);

