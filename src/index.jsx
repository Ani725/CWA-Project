import React from 'react';
import ReactDOM from 'react-dom/client'; // Use this for React 18 and later
import App from './App'; // Make sure the App component is in the correct directory
import './styles/App.css'; // Your custom styles if needed

// Assuming that `root` is the div in your index.html with id="root"
const rootElement = document.getElementById('root');

// This is how you render a React component to the DOM in React 18+
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
