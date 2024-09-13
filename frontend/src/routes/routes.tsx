import { Routes, Route } from 'react-router-dom';
import UserTypeSelection from '../components/Auth/UserTypeSelection';
import Login from '../components/Auth/Login';
import ForgotPassword from '../components/Auth/ForgotPassword';
import PasswordResetSuccess from '../components/Auth/PasswordResetSuccess';
import VerifyEmail from '../components/Auth/verifyEmail';
import RegisterForm from '../components/Auth/RegisterForm';
import ResetPassword from '../components/Auth/ResetPassword';
import AuthHeader from '../components/Auth/AuthHeader';
import logo from '../assets/images/logo.jpg';
import { useState } from 'react';
import LandingPage from '../components/LandingPage';
import ProductList from '../components/user/ProductList';
import ArtisanDashboard from '../components/Artisan/ArtisanDashboard';
import ProductDetails from '../components/user/ProductDetails';
import Wishlist from '../components/wishlist';
import Cart from '../components/cart';
import Checkout from '../components/user/Checkout';

const Navigation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <Routes>
      {/* Routes with AuthHeader */}
      <Route path="/register" element={<><AuthHeader logoSrc={logo} show={true} /><RegisterForm /></>} />
      <Route path="/login" element={<><AuthHeader logoSrc={logo} show={true} /><Login /></>} />
      <Route path="/forgetpassword" element={<><AuthHeader logoSrc={logo} show={true} /><ForgotPassword /></>} />
      <Route path="/api/auth/resetpassword/:resetToken" element={<><AuthHeader logoSrc={logo} show={true} /><ResetPassword /></>} />
      <Route path="/api/auth/verify/:token" element={<><AuthHeader logoSrc={logo} show={true} /><VerifyEmail /></>} />
 
      <Route path="/" element={<LandingPage />} />

      {/* Routes without AuthHeader */}
      <Route path="/autheader" element={<AuthHeader logoSrc={logo} show={false} />} />
      <Route path="/usertype" element={<UserTypeSelection open={isDialogOpen} onClose={handleCloseDialog} />} />
      <Route path="/passwordresetSuccess" element={<PasswordResetSuccess />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/dashboard" element={<ArtisanDashboard />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      <Route path="/Wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />




    </Routes>
  );
};

export default Navigation;
