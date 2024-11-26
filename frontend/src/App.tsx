import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import AuthForms from './components/AuthForm'
import { AuthProvider, useAuth } from './context/AuthContext'
import MainPage from './components/MainPage'
import Projects from './components/Projects'
import Users from './components/Users'
import Welcome from './components/Welcome'
import MapComponent from './components/Map'
import UserForm from './components/UserForm'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthRoute />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Welcome />} />
            <Route path="projects" element={<Projects />} />
            <Route path="users" element={<Users />} />
            <Route path="map" element={<MapComponent />} />
            <Route path="/:userId" element={<UserForm />} />
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  )
}

function PrivateRoute() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <MainPage />
}

function AuthRoute() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }

  return <AuthForms />
}

export default App
