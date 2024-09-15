import { Box } from '@mui/material';

export const ReversedCard = (options?: {
  text?: string;
}): React.JSX.Element => {
  return (
    <Box component="div" className="cornie-card">
      <Box component="div" className="cornie-card-inner-border">
        <Box component="div" className="cornie-card-inner-content">
          <Box component="div" className="cornie-card-icon">
            <svg preserveAspectRatio="none" viewBox="0 0 200 200">
              <path
                d="M 100,10 L 50,190 L150,190 Z"
                style={{
                  strokeWidth: 7,
                }}
              />
              <path
                d="M84 66 L116 66 Z"
                style={{
                  strokeWidth: 7,
                }}
              />
              <path
                d="M66 130 L134 130 Z"
                style={{
                  strokeWidth: 7,
                }}
              />
            </svg>
          </Box>
          <Box component="div" className="cornie-card-text">
            {options?.text ?? 'CORNIE'}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
