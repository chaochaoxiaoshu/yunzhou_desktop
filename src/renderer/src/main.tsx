import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import WithLoginForm from './components/with-login-form'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root') as HTMLElement

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <WithLoginForm>
        <RouterProvider router={router} />
      </WithLoginForm>
    </React.StrictMode>
  )
}
