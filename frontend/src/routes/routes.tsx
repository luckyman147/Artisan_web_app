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

const Navigation = () => {
  return (
    <Routes>
      {/* Routes with AuthHeader */}
      <Route path="/register" element={<><AuthHeader logoSrc={logo} show={true} /><RegisterForm /></>} />
      <Route path="/login" element={<><AuthHeader logoSrc={logo} show={true} /><Login /></>} />
      <Route path="/forgetpassword" element={<><AuthHeader logoSrc={logo} show={true} /><ForgotPassword /></>} />
      <Route path="/api/auth/resetpassword/:resetToken" element={<><AuthHeader logoSrc={logo} show={true} /><ResetPassword /></>} />
      <Route path="/api/auth/verify/:token" element={<><AuthHeader logoSrc={logo} show={true} /><VerifyEmail /></>} />
      
      {/* Routes without AuthHeader */}
      <Route path="/" element={<AuthHeader logoSrc={logo} show={false} />} />
      <Route path="/usertype" element={<UserTypeSelection />} />
      <Route path="/passwordresetSuccess" element={<PasswordResetSuccess />} />

    </Routes>
  );
};

export default Navigation;
