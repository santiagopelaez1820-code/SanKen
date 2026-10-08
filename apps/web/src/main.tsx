// Esta línea sirve para importar «StrictMode» desde «react».
import { StrictMode } from 'react'
// Esta línea sirve para importar «createRoot» desde «react-dom/client».
import { createRoot } from 'react-dom/client'
// Esta línea sirve para importar «QueryClient, QueryClientProvider» desde «@tanstack/react-query».
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Esta línea sirve para importar «BrowserRouter» desde «react-router-dom».
import { BrowserRouter } from 'react-router-dom'
// Esta línea sirve para importar los efectos secundarios de «./styles/bootstrap-theme.scss».
import './styles/bootstrap-theme.scss'
// Esta línea sirve para importar los efectos secundarios de «./index.css».
import './index.css'
// Esta línea sirve para importar «App» desde «./App.tsx».
import App from './App.tsx'

// Esta línea sirve para declarar «queryClient» con el valor «new QueryClient({».
const queryClient = new QueryClient({
  // Esta línea sirve para declarar la propiedad «defaultOptions» con el valor o tipo «{».
  defaultOptions: {
    // Esta línea sirve para declarar la propiedad «queries» con el valor o tipo «{».
    queries: {
      // Esta línea sirve para declarar la propiedad «retry» con el valor o tipo «1».
      retry: 1,
      // Esta línea sirve para declarar la propiedad «staleTime» con el valor o tipo «30_000».
      staleTime: 30_000,
    },
  },
})

// Esta línea sirve para crear la raíz de React y dibujar la aplicación.
createRoot(document.getElementById('root')!).render(
  // Esta línea sirve para abrir el componente «StrictMode».
  <StrictMode>
    {/* Esta línea sirve para abrir el componente «QueryClientProvider». */}
    <QueryClientProvider client={queryClient}>
      {/* Esta línea sirve para abrir el componente «BrowserRouter». */}
      <BrowserRouter>
        {/* Esta línea sirve para abrir el componente «App». */}
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
