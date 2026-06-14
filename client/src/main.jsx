import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { Provider } from 'react-redux'
import {store} from './store/app.store'
import { routes } from './app/app.route'
import { RouterProvider } from 'react-router'
import './index.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
)
