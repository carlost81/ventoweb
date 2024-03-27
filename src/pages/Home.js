import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RouterLink } from '../components/router-link';
import { SalesStats } from '../../src/components/sales/sales-stats';
import { SalesPaymentMethod } from '../components/sales/sales-payment-method';
import { EcommerceSalesTable } from '../../src/components/dashboard/ecommerce-sales-table';
import { DashboardLayout } from '../components/dashboard-layout';
import { paths } from '../paths';
import { getSelectedSale } from '../actions'
import { SalesTable } from '../components/sales/sales-table';
import { useNavigate } from 'react-router-dom'


const Home = () => {

  const navigate = useNavigate();
  const summaryStats = useSelector((state) => state.summaryStats);
  const config = JSON.parse(localStorage.getItem('config'))
  const user = JSON.parse(localStorage.getItem('user'))
  console.log('user..',user,'config..',config)

  const handleAddClick = () => () => {
    console.log(1)
    getSelectedSale(null);
    navigate(paths.sale);
  };


  return (
    <DashboardLayout>
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">
                    {user?.displayName}
                  </Typography>
                </div>

                  <Button
                    variant="contained"
                    //component={RouterLink}
                    //href={paths.sale}
                    onClick={handleAddClick()}
                  >Registrar Ventas
                  </Button>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              lg={8}
            >
              <Stack
                spacing={{
                  xs: 3,
                  lg: 4
                }}
              >
                <SalesStats
                  cost={summaryStats?.sales-summaryStats?.profit}
                  profit={summaryStats?.profit}
                  sales={summaryStats?.sales}
                />
                <SalesTable
                />
              </Stack>
            </Grid>
            <Grid
              xs={12}
              lg={4}
            >
              <Stack
                spacing={{
                  xs: 3,
                  lg: 4
                }}
              >
                <SalesPaymentMethod
                  chartSeries={[{value:summaryStats?.typeC}, {value:summaryStats?.typeT}]}
                  labels={['Efectivo', 'Transferencia']}
                />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  </DashboardLayout>
  );
}

Home.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Home