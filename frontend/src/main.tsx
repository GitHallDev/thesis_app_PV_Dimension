import { BrowserRouter } from 'react-router'
import {base_path} from './environement.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store.tsx'
import AllRoutes from './routers/router.tsx'
import App from './App.tsx'
import './App.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={base_path}>
      <AllRoutes />
      </BrowserRouter>
    {/* <App /> */}
    </Provider>
  </StrictMode>,
)
