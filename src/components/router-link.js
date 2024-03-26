import { forwardRef } from 'react';
import {Link} from 'react-router-dom';

/**
 * This is a wrapper over `next/link` component.
 * We use this to help us maintain consistency between CRA and Next.js
 */
export const RouterLink = forwardRef((props, ref) => (
  <Link
    to={ref}
    {...props} />
));
