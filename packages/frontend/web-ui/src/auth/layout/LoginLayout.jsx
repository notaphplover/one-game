import { Grid, Typography } from '@mui/material';

export const LoginLayout = ({ children, title = '' }) => {
  return (
    <Grid
      className="bkg-layout"
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item sx={{ mb: 2 }}>
        <Typography
          className="contrast-text-hover"
          variant="h4"
          noWrap
          component="a"
          href="/"
          sx={{
            ml: 3,
            mr: 5,
            fontFamily: 'Gochi Hand',
            fontWeight: 'bold',
            fontSize: 50,
            letterSpacing: '.3rem',
            textDecoration: 'none',
            color: 'primary.dark',
          }}
        >
          CORNIE
        </Typography>
      </Grid>

      <Grid
        item
        className="box-shadow"
        xs={3}
        sx={{
          backgroundColor: 'primary.white',
          borderRadius: 2,
          color: 'primary.light',
          padding: 3,
          width: { sm: 450 },
        }}
      >
        <Typography variant="h5" sx={{ mb: 1, paddingBottom: 2 }}>
          {' '}
          {title}{' '}
        </Typography>

        {children}
      </Grid>
    </Grid>
  );
};
