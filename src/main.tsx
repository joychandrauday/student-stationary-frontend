import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from './routes/Routes';
import { Provider } from 'react-redux'
import { persistor, store } from './Redux/features/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} >

        </RouterProvider>
        <Toaster />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
