import './App.css'
import { AuthProvider } from './providers/Auth'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
