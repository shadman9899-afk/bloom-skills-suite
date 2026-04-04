// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Clear the loading indicator immediately
const rootElement = document.getElementById('root')
if (rootElement) {
    // Clear the loading HTML
    rootElement.innerHTML = ''
}

ReactDOM.createRoot(rootElement!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)