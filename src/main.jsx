import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/store'
import { TranslationProvider } from './context/TranslationContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <TranslationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TranslationProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
