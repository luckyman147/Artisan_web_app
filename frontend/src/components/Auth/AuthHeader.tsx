// AuthHeader.tsx
import React from 'react';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface AuthHeaderProps {
  logoSrc: any; 
  show: boolean;   
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ logoSrc, show }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  if (!show) {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#0375FB',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1300, 
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <div style={{ flexGrow: 1, textAlign: 'right' }}>
          <img
            src={logoSrc}
            alt="Logo"
            style={{ height: 50, borderRadius: 50, cursor: 'pointer' }}
            onClick={handleLogoClick} 
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AuthHeader;
