import { useEffect } from 'react';
//import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { paths } from '../paths';
import { ChartBar as ChartBarIcon } from '../images/chart-bar';
import { Cog as CogIcon } from '../images/cog';
import { Lock as LockIcon } from '../images/lock';
import { Selector as SelectorIcon } from '../images/selector';
import { ShoppingBag as ShoppingBagIcon } from '../images/shopping-bag';
import { User as UserIcon } from '../images/user';
import { UserAdd as UserAddIcon } from '../images/user-add';
import { Users as UsersIcon } from '../images/users';
import { XCircle as XCircleIcon } from '../images/x-circle';
import { NavItem } from './nav-item';

const items = [
  {
    href: paths.home,
    icon: (<ChartBarIcon fontSize="small" />),
    title: 'Dashboards'
  },
/*   {
    href: '/home',
    icon: (<UsersIcon fontSize="small" />),
    title: 'Customers'
  }, */
  {
    href: paths.products,
    icon: (<ShoppingBagIcon fontSize="small" />),
    title: 'Products'
  },
/*   {
    href: '/account',
    icon: (<UserIcon fontSize="small" />),
    title: 'Account',
  },
  {
    href: '/settings',
    icon: (<CogIcon fontSize="small" />),
    title: 'Settings'
  }, */
  {
    href: paths.loggout,
    icon: (<LockIcon fontSize="small" />),
    title: 'Loggout'
  },
];

export const DashboardSidebar = (props) => {

  const company = JSON.parse(localStorage.getItem('company'))
  console.log('sidebar:',company)
  const { open, onClose } = props;
  console.log('open',open)
  //const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      /*if (!router.isReady) {
        return;
      }*/

      /*if (open) {
        onClose?.();
      }*/
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
   // [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
                py: '11px',
                borderRadius: 1
              }}
            >
              <div>
                <Typography
                  color="inherit"
                  variant="subtitle1"
                >
                  {company?.company}
                </Typography>
                <Typography
                  color="neutral.400"
                  variant="body2"
                >
                  Fin Suscripcion
                  {' '}
                  : {company?.endDate}
                </Typography>
              </div>
              <SelectorIcon
                sx={{
                  color: 'neutral.500',
                  width: 14,
                  height: 14
                }}
              />
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />
        <Box
          sx={{
            px: 2,
            py: 3
          }}
        >
          <Box
            sx={{
              display: 'flex',
              mt: 2,
              mx: 'auto',
              width: '160px',
              '& img': {
                width: '100%'
              }
            }}
          >
          </Box>
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};