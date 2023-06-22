import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Stack,
    Typography,
    Unstable_Grid2 as Grid
  } from '@mui/material';
import numeral from 'numeral';

import { formatCurrency } from '../../utils/money-format';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSalesTodayDetail } from '../../actions'

  export const EcommerceStats = (props) => {
    //companyId = '-LmL9e3qn0Tjft18B4ob'
    const { cost, profit, sales,companyId = '1' } = props;
  
    const salesToday = useSelector((state) => state.salesToday);
    const salesTodayTotalSale = useSelector((state) => numeral(state.salesTodayTotalSale).format('$0.[0]a'));
    const salesTodayTotalCost = useSelector((state) => numeral(state.salesTodayTotalCost).format('$0.[0]a'));
    const salesTodayTotalProfit= useSelector((state) => numeral(state.salesTodayTotalSale-state.salesTodayTotalCost).format('$0.[0]a'));

    useEffect(() => {
        console.log('ecommerce-stat')
        if(salesToday == null ){
            getSalesTodayDetail({companyId:companyId});
        }
      }, []);
  
    return (
      <Card>
        <CardHeader
          title="18-Marzo-2023"
          sx={{ pb: 0 }}
        />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'neutral.800'
                    : 'error.lightest',
                  borderRadius: 2.5,
                  px: 3,
                  py: 4
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    height: 48,
                    width: 48,
                    '& img': {
                      width: '100%'
                    }
                  }}
                >
                  <img src="/assets/iconly/iconly-glass-chart.svg" />
                </Box>
                <div>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    Ventas
                  </Typography>
                  <Typography variant="h5">
                    {salesTodayTotalSale}
                  </Typography>
                </div>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'neutral.800'
                    : 'warning.lightest',
                  borderRadius: 2.5,
                  px: 3,
                  py: 4
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    height: 48,
                    width: 48,
                    '& img': {
                      width: '100%'
                    }
                  }}
                >
                  <img src="/assets/iconly/iconly-glass-discount.svg" />
                </Box>
                <div>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    Costos
                  </Typography>
                  <Typography variant="h5">
                    {salesTodayTotalCost}
                  </Typography>
                </div>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'neutral.800'
                    : 'success.lightest',
                  borderRadius: 2.5,
                  px: 3,
                  py: 4
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    height: 48,
                    width: 48,
                    '& img': {
                      width: '100%'
                    }
                  }}
                >
                  <img src="/assets/iconly/iconly-glass-tick.svg" />
                </Box>
                <div>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    Utilidad
                  </Typography>
                  <Typography variant="h5">
                    {salesTodayTotalProfit}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
  