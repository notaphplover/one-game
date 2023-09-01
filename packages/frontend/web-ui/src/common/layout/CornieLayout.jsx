import { Box } from '@mui/material';
import { Footer, Navbar } from '../components';

/**
 * @param {boolean} withFooter
 * @param {boolean} withNavBar
 * @returns {string}
 */
function getLayoutBoxClassName(withFooter, withNavBar) {
  let layoutBoxClassNames = ['bkg-layout'];

  if (withFooter) {
    const additionalClass =
      withNavBar === true ? 'fixed-navbar-footer' : 'fixed-footer';

    layoutBoxClassNames.push(additionalClass);
  }

  return layoutBoxClassNames.join(' ');
}

export const CornieLayout = ({
  children,
  withFooter = false,
  withNavBar = false,
}) => {
  const navbar = withNavBar === true ? <Navbar /> : undefined;
  const footer = withFooter === true ? <Footer /> : undefined;

  return (
    <Box className={getLayoutBoxClassName(withFooter, withNavBar)}>
      {navbar}

      <article>{children}</article>

      {footer}
    </Box>
  );
};
