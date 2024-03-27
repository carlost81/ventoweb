import { DashboardLayout } from '../components/dashboard-layout';
import { RouterLink } from '../components/router-link';
import { SaleCreateForm } from '../components/sales/sale-create-form';
import { paths } from '../paths';
import { useCallback, useMemo, useState } from 'react';
import { Box, Breadcrumbs, Container, Grid, Stack, Typography } from '@mui/material';
import { BreadcrumbsSeparator } from '../components/breadcrumbs-separator';


const Sale = (props) => {
  console.log('Sale props', props);
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
      <Container maxWidth={false}>
      <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">
                    Registrar Venta
                  </Typography>
                </div>
              </Stack>
            </Grid>
            <SaleCreateForm />
      </Container>

      </Box>
    </>
  </DashboardLayout>
      );
}

export default Sale