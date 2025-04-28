import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MediaDetailsPage from './pages/MediaDetailsPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout.tsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans bg-netflix-black text-white min-h-screen flex flex-col">
          <Navbar />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/movie/:id" element={<MediaDetailsPage />} />
              <Route path="/tv/:id" element={<MediaDetailsPage />} />
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
            </Route>
          </Routes>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
              duration: 3000,
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;