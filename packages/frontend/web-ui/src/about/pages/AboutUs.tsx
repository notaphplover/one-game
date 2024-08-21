import { Box, Grid, Typography } from '@mui/material';

import { CornieLayout } from '../../common/layout/CornieLayout';

export const AboutUs = (): React.JSX.Element => {
  return (
    <CornieLayout withFooter withNavBar>
      <Grid container>
        <Grid item sx={{ margin: '0 auto', maxWidth: '1200px' }}>
          <Box component="span" sx={{ color: 'primary.dark', p: 10 }}>
            <Typography
              variant="h3"
              component="h3"
              sx={{ fontWeight: 'bold', lineHeight: 2, textAlign: 'justify' }}
            >
              About Us
            </Typography>
            <Typography
              component="p"
              sx={{ lineHeight: 2, textAlign: 'justify' }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
              <br />
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
              <br />
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </CornieLayout>
  );
};
