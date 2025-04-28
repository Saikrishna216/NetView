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
import Layout from './components/Layout'; // Ensure the Layout component exists in the specified path

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans bg-netflix-black text-white min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="movie/:id" element={<MediaDetailsPage mediaType="movie" />} />
              <Route path="tv/:id" element={<MediaDetailsPage mediaType="tv" />} />
              <Route 
                path="profile" 
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } 
              />
            </Route>
          </Routes>
        </div>
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
      </Router>
    </AuthProvider>
  );
}

export default App;