import { DashboardLayout } from '../components/dashboard-layout';
import { RouterLink } from '../components/router-link';
import { ProductCreateForm } from '../components/products/product-create-form';
import { paths } from '../paths';
import { useCallback, useMemo, useState } from 'react';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useSelection } from '../hooks/use-selection';
import { Box, Breadcrumbs, Container, Link, Stack, Typography } from '@mui/material';
import { ProductsTable } from '../components/products/products-table';
import { BreadcrumbsSeparator } from '../components/breadcrumbs-separator';
import { applyPagination } from '../utils/apply-pagination';

const now = new Date();

const Product = () => {
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
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">
              Crear Producto
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
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.products}
                variant="subtitle2"
              >
                Products
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                Create
              </Typography>
            </Breadcrumbs>
          </Stack>
            <ProductCreateForm />
        </Stack>
      </Container>

      </Box>
    </>
  </DashboardLayout>
      );
}

export default Product