import { Routes, Route } from "react-router-dom";
import UserTypeSelection from "../components/Auth/UserTypeSelection";
import Login from "../components/Auth/Login";
import ForgotPassword from "../components/Auth/ForgotPassword";
import PasswordResetSuccess from "../components/Auth/PasswordResetSuccess";
import VerifyEmail from "../components/Auth/verifyEmail";
import RegisterForm from "../components/Auth/RegisterForm";
import ResetPassword from "../components/Auth/ResetPassword";
import AuthHeader from "../components/Auth/AuthHeader";
import logo from "../assets/images/logo.jpg";
import { useState } from "react";
import LandingPage from "../components/LandingPage";
import ProductList from "../components/user/ProductList";
import ArtisanDashboard from "../components/Artisan/ArtisanDashboard";
import ProductDetails from "../components/user/ProductDetails";
import Wishlist from "../components/wishlist";
import Checkout from "../components/user/UserOrders/Checkout";
import UserSetting from "../components/user/UserSetting";
import ArtisanList from "../components/user/ArtisanList";
import Dashboard from "../components/Admin/components/Dashboard";
import UserTable from "../components/Admin/pages/UserTable";
import ArtisanTable from "../components/Admin/pages/ArtisanTable";
import AdminSettings from "../components/Admin/pages/AdminSettings";
import ProductsTable from "../components/Admin/pages/ProductsTable";
import OrderListArtisan from "../components/Artisan/ArtisanOrders/OrderListArtisan";
import ArtisanProfile from "../components/Artisan/ArtisanProfile/ArtisanProfile";
import OrderList from "../components/user/UserOrders/OrderList";
import Cart from "../components/cart/cart";
import { PrivateAdminRoute, PrivateRoute } from "./PrivateRoute";

const Navigation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <Routes>
      {/* Routes with AuthHeader */}
      <Route
        path="/register"
        element={
          <>
            <AuthHeader logoSrc={logo} show={true} />
            <RegisterForm />
          </>
        }
      />
      <Route
        path="/login"
        element={
          <>
            <AuthHeader logoSrc={logo} show={true} />
            <Login />
          </>
        }
      />
      <Route
        path="/forgetpassword"
        element={
          <>
            <AuthHeader logoSrc={logo} show={true} />
            <ForgotPassword />
          </>
        }
      />
      <Route
        path="/api/auth/resetpassword/:resetToken"
        element={
          <>
            <AuthHeader logoSrc={logo} show={true} />
            <ResetPassword />
          </>
        }
      />
      <Route
        path="/api/auth/verify/:token"
        element={
          <>
            <AuthHeader logoSrc={logo} show={true} />
            <VerifyEmail />
          </>
        }
      />

      <Route path="/" element={<LandingPage />} />

      {/* Routes without AuthHeader */}
      <Route
        path="/autheader"
        element={<AuthHeader logoSrc={logo} show={false} />}
      />
      <Route
        path="/usertype"
        element={
          <UserTypeSelection open={isDialogOpen} onClose={handleCloseDialog} />
        }
      />
      <Route path="/passwordresetSuccess" element={<PasswordResetSuccess />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/dashboard" element={<PrivateRoute><ArtisanDashboard /></PrivateRoute>} />
      <Route path="/product/:id" element={<ProductDetails />} />

      <Route path="/Wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<OrderList />} />
      <Route path="/orderartisan" element={<OrderListArtisan />} />
      <Route path="/artisan/profile/:userId" element={<ArtisanProfile />} />
      <Route path="/settings" element={<UserSetting />} />
      <Route path="/artisanlist" element={<ArtisanList />} />

 
      {/* Admin Routes */}
      <Route
        path="/Admin_dashboard"
        element={
          <PrivateAdminRoute>
            <Dashboard />
          </PrivateAdminRoute>
        }
      />
      <Route
        path="/Admin_user"
        element={
          <PrivateAdminRoute>
            <UserTable />
          </PrivateAdminRoute>
        }
      />
      <Route
        path="/Admin_artisan"
        element={
          <PrivateAdminRoute>
            <ArtisanTable />
          </PrivateAdminRoute>
        }
      />
      <Route
        path="/Admin_settings"
        element={
          <PrivateAdminRoute>
            <AdminSettings />
          </PrivateAdminRoute>
        }
      />
      <Route
        path="/Admin_products"
        element={
          <PrivateAdminRoute>
            <ProductsTable />
          </PrivateAdminRoute>
        }
      />
    </Routes>
  );
};

export default Navigation;
