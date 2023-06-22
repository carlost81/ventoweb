import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography
} from '@mui/material';
import { applySort } from '../../utils/apply-sort';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/money-format';

export const EcommerceSalesTable = (props) => {
  const { visits } = props;
  const [sort, setSort] = useState('desc');

  const salesToday = useSelector((state) => state.salesToday);

  const sortedVisits = useMemo(() => {
    return applySort(visits, 'value', sort);
  }, [visits, sort]);

  const handleSort = useCallback(() => {
    setSort((prevState) => {
      if (prevState === 'asc') {
        return 'desc';
      }

      return 'asc';
    });
  }, []);

  return (
    <Card>
      <CardHeader
        title="Registro de ventas"
        action={(
          <Tooltip title="Refresh rate is 24h">
            <SvgIcon color="action">
            </SvgIcon>
          </Tooltip>
        )}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Almacen
            </TableCell>
            <TableCell sortDirection={sort}>
              <TableSortLabel
                active
                direction={sort}
                onClick={handleSort}
              >
                Ventas
              </TableSortLabel>
            </TableCell>
            <TableCell>
              Utilidad
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salesToday?.map((sale) => {
            return (
              <TableRow
                key={sale.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    <Box
                      sx={{
                        height: 16,
                        width: 16,
                        '& img': {
                          height: 16,
                          width: 16
                        }
                      }}
                    >
                    </Box>
                    <Typography
                      sx={{ ml: 1 }}
                      variant="subtitle2"
                    >
                      {sale.s}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {formatCurrency(sale.tt)}
                </TableCell>
                <TableCell>
                  {formatCurrency(sale.tt-sale.ct)+' - '+(sale.ct>0?(Math.round((sale.tt-sale.ct)/sale.ct*100)):'-')+'%'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

EcommerceSalesTable.propTypes = {
  visits: PropTypes.array.isRequired
};
