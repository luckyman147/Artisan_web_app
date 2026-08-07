import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton,
  Box,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface AuthHeaderProps {
  logoSrc: string;
  show: boolean;
  variant?: 'default' | 'compact';
}

const ModernAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  backdropFilter: 'blur(8px)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  marginBottom: '40px', // Explicit 40px margin bottom
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const HeaderToolbar = styled(Toolbar)(({ theme }) => ({
  padding: theme.spacing(0, 4),
  minHeight: '72px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2),
    minHeight: '64px'
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)'
  }
}));

const ProfessionalLogo = styled('img')(({ theme }) => ({
  height: '44px',
  width: '44px',
  borderRadius: '12px',
  objectFit: 'contain',
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  [theme.breakpoints.down('sm')]: {
    height: '36px',
    width: '36px'
  }
}));

const BackActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  marginRight: theme.spacing(2),
  padding: theme.spacing(1.25),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.08)'
  }
}));

const AuthHeader: React.FC<AuthHeaderProps> = ({ 
  logoSrc, 
  show, 
  variant = 'default' 
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogoClick = () => {
    navigate('/');
  };

  if (!show) return null;

  return (
    <ModernAppBar position="fixed" sx={{ 
      mb: '40px', // Double assurance of 40px margin
      ...(variant === 'compact' && { 
        minHeight: '60px',
        '.MuiToolbar-root': {
          minHeight: '60px'
        }
      })
    }}>
      <HeaderToolbar>
        <BackActionButton 
          onClick={() => navigate(-1)}
          aria-label="go back"
          size={isMobile ? 'small' : 'medium'}
        >
          <ArrowBackIcon fontSize={isMobile ? 'medium' : 'large'} />
        </BackActionButton>

        <Box sx={{ flex: 1 }} />

        <LogoContainer onClick={handleLogoClick}>
          <ProfessionalLogo 
            src={logoSrc} 
            alt="Company Logo" 
          />
          {!isMobile && (
            <Box sx={{ 
              color: 'common.white',
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '0.3px'
            }}>
              Your Brand
            </Box>
          )}
        </LogoContainer>
      </HeaderToolbar>
    </ModernAppBar>
  );
};

export default AuthHeader;