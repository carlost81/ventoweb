import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
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
import { EcommercePaymentMethod } from '../../src/components/dashboard/ecommerce-payment-method';
import { EcommerceSalesTable } from '../../src/components/dashboard/ecommerce-sales-table';
import { DashboardLayout } from '../components/dashboard-layout';
import { paths } from '../paths';
import { getSelectedSale } from '../actions'
import { SalesTable } from '../components/sales/sales-table'


const Home = () => {

  const summaryStats = useSelector((state) => state.summaryStats);
  const config = JSON.parse(localStorage.getItem('config'))
  const user = JSON.parse(localStorage.getItem('user'))

  const handleAddClick = () => () => {
    getSelectedSale(null);
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
                    LaFemma
                  </Typography>
                </div>

                  <Button
                    variant="contained"
                    component={RouterLink}
                    href={paths.sale}
                    onClick={handleAddClick()}
                  >Registrar Venta
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
                cost={summaryStats.sales-summaryStats.profit}
                profit={summaryStats.profit}
                sales={summaryStats.sales}
              />

            <SalesTable
            />
{/*               <EcommerceSalesTable
                visits={[
                  {
                    id: 'us',
                    name: 'Julieth F',
                    seoPercentage: 40,
                    value: 31200
                  },
                  {
                    id: 'uk',
                    name: 'Jeidy',
                    seoPercentage: 47,
                    value: 12700
                  },
                  {
                    id: 'ru',
                    name: 'Jeidy',
                    seoPercentage: 65,
                    value: 10360
                  },
                  {
                    id: 'ca',
                    name: 'Camila',
                    seoPercentage: 23,
                    value: 5749
                  },
                  {
                    id: 'de',
                    name: 'Germany',
                    seoPercentage: 45,
                    value: 2932
                  },
                  {
                    id: 'es',
                    name: 'Spain',
                    seoPercentage: 56,
                    value: 200
                  },
                  {
                    id: 'es',
                    name: 'Spain2',
                    seoPercentage: 56,
                    value: 200
                  }
                ]}
              /> */}
                
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
                <EcommercePaymentMethod
                  chartSeries={[summaryStats.typeC, summaryStats.typeT]}
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