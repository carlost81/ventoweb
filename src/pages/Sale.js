import Head from 'next/head';
import { DashboardLayout } from '../components/dashboard-layout';
import { RouterLink } from '../components/router-link';
import { SaleCreateForm } from '../components/sales/sale-create-form';
import { paths } from '../paths';
import { useCallback, useMemo, useState } from 'react';
import { Box, Breadcrumbs, Container, Link, Stack, Typography } from '@mui/material';
import { BreadcrumbsSeparator } from '../components/breadcrumbs-separator';


const Sale = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

    return (

  <DashboardLayout>
<>
      <Head>
        <title>
          Productos | Vento
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">
              Registrar Venta
            </Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.home}
                variant="subtitle2"
              >
                Dashboard
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Crear Venta
              </Typography>
            </Breadcrumbs>
          </Stack>
            <SaleCreateForm />
        </Stack>
      </Container>

      </Box>
    </>
  </DashboardLayout>
      );
}

export default Sale