import { Box } from '@mui/material';
import { ReversedCard } from '../../game/components/ReversedCard';

export const LogoCard = () => {
  return (
    <Box component="div" className="home-cards-grid">
      <Box component="div" className="home-cards-grid-element card-left">
        <Box component="div" className="home-card-animation-panel">
          <ReversedCard></ReversedCard>
        </Box>
      </Box>
      <Box component="div" className="home-cards-grid-element card-middle">
        <Box component="div" className="home-card-animation-panel">
          <ReversedCard></ReversedCard>
        </Box>
      </Box>
      <Box component="div" className="home-cards-grid-element card-right">
        <Box component="div" className="home-card-animation-panel">
          <ReversedCard></ReversedCard>
        </Box>
      </Box>
    </Box>
  );
};
