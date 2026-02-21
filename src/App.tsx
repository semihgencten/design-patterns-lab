import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './app/routes.tsx'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-dark-surface text-gray-100 flex flex-col">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
