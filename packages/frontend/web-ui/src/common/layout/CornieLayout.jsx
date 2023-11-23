import { Box } from '@mui/material';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

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
  id,
  withFooter = false,
  withNavBar = false,
}) => {
  const navbar = withNavBar === true ? <Navbar /> : undefined;
  const footer = withFooter === true ? <Footer /> : undefined;

  return (
    <Box
      component="div"
      className={getLayoutBoxClassName(withFooter, withNavBar)}
      id={id}
    >
      {navbar}

      <article>{children}</article>

      {footer}
    </Box>
  );
};
