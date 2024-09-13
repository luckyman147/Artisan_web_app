import { useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, Dialog, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/system';
import clientType from '../../assets/images/clientType.png';
import artisanType from '../../assets/images/artisanType.png';
import { useAppDispatch } from "../../stores/storeHooks";
import { setUserRole } from '../../stores/slice/userTypeSlice';
import { useNavigate } from 'react-router-dom';

interface StyledCardProps {
  selected?: boolean;
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<StyledCardProps>(({ selected }) => ({
  width: '200px',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
  border: selected ? '2px solid gold' : '1px solid #ccc',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));


interface UserTypeSelectionProps {
  open: boolean;
  onClose: () => void;
}

export default function UserTypeSelection({ open, onClose }: UserTypeSelectionProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleArtisanClick = () => {
    setSelectedCard('artisan');
  };

  const handleClientClick = () => {
    setSelectedCard('user');
  };

  const handleContinueClick = () => {
    if (selectedCard) {
      const role = selectedCard === 'artisan' ? 'artisan' : 'user';  
      dispatch(setUserRole(role));
      navigate("/register")
      
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '800px', 
          height: '600px', 
          maxHeight: '80vh', 
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
        },
      }}
    >
      <DialogContent sx={{ flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="h4" gutterBottom>
            SELECT USER TYPE
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <StyledCard 
                onClick={handleArtisanClick} 
                selected={selectedCard === 'artisan'}
              >
                <CardContent>
                  <img src={artisanType} alt="Artisan Icon" style={{ width: '100px', height: '100px' }} />
                  <Typography variant="h6">Artisan</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item>
              <StyledCard 
                onClick={handleClientClick} 
                selected={selectedCard === 'user'}
              >
                <CardContent>
                  <img src={clientType} alt="Client Icon" style={{ width: '100px', height: '100px' }} />
                  <Typography variant="h6">Client</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
          <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleContinueClick}
              disabled={!selectedCard}
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
