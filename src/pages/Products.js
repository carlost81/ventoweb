import { DashboardLayout } from '../components/dashboard-layout';
import { useCallback, useMemo, useState } from 'react';
import { subDays, subHours } from 'date-fns';
import { RouterLink } from '../components/router-link';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useSelection } from '../hooks/use-selection';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { ProductsTable } from '../components/products/products-table';
import { applyPagination } from '../utils/apply-pagination';
import { paths } from '../paths';
import { useNavigate } from 'react-router-dom'

const now = new Date();

const Products = () => {

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleAddClick = () => () => {
    console.log(1)
    navigate(paths.product);
  };

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
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Productos
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                    onClick={handleAddClick()}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <ProductsTable
              count={5}
              items={{car:'dd'}}
              //onDeselectAll={customersSelection.handleDeselectAll}
              //onDeselectOne={customersSelection.handleDeselectOne}
              //onPageChange={handlePageChange}
              //onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              //rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  </DashboardLayout>
      );
}
Products.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);
export default Products