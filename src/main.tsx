// main.tsx
// Entry point for the React frontend application. Renders the root component.

import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

/* styles.css
   Contains global styles for the LCS Alliance University web application.
*/
