import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrderBookPage from './pages/OrderBookPage';
import MyOrdersPage from './pages/MyOrdersPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
import { AuthProvider } from './store/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="bg-background min-h-screen text-textPrimary">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orderbook/:symbol" element={<OrderBookPage />} />
          <Route path="/myorders" element={<MyOrdersPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
