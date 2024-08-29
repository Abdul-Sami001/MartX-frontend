import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LogoutButton from './components/LogoutButton';
import Dashboard from './pages/Dashboard';
import ImageUpload from './components/Image';
function App() {
  return (
    <>
    <Router>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/seller" element={<Dashboard />} />
          <Route path="/image" element={<ImageUpload />} />
        {/* Other routes go here */}
      </Routes>
    </Router>
      <LogoutButton />
    </>
  );
}

export default App;
