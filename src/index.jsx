import React from 'react';
import ReactDOM from 'react-dom/client'; // Use react-dom/client for React 18
import { BrowserRouter } from 'react-router-dom';
import App from './App'; 
import './styles/App.css'; 

const rootElement = document.getElementById('root');

// Render a React component to the DOM in React 18+
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
