import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { EnhancedDataProvider } from './context/EnhancedDataContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <EnhancedDataProvider>
        <App />
      </EnhancedDataProvider>
    </BrowserRouter>
  </React.StrictMode>,
)