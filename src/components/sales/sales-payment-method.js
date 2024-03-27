import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';

const useChartOptions = (labels) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent'
    },
    colors: [
      theme.palette.neutral[200],
      theme.palette.info.main,
      theme.palette.primary.main,
      theme.palette.warning.main
    ],
    dataLabels: {
      enabled: false
    },
    labels,
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

export const SalesPaymentMethod = (props) => {
  const { chartSeries, labels } = props;
  const chartOptions = useChartOptions(labels);

  const theme = useTheme();
  return (
    <Card>
      <CardHeader
        title="Metodos de Pago"
      />
      <CardContent>
        <PieChart
          colors= {[
            theme.palette.neutral[200],
            theme.palette.info.main,
            theme.palette.primary.main,
            theme.palette.warning.main
          ]}
          series={[
            {
              data:chartSeries,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
      height={200}
    />
        <Table>
          <TableHead
            sx={{
              [`& .${tableCellClasses.root}`]: {
                background: 'transparent'
              }
            }}
          >
            <TableRow>
              <TableCell>
                Metodo
              </TableCell>
              <TableCell align="right">
                Valor
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              [`& .${tableCellClasses.root}`]: {
                border: 0
              }
            }}
          >
            {chartSeries?.map((item, index) => {
              const amount = numeral(item?.value).format('$0,0.00');

              return (
                <TableRow key={index}>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: chartOptions.colors[index],
                          borderRadius: '50%',
                          height: 8,
                          mr: 1,
                          width: 8
                        }}
                      />
                      <Typography variant="subtitle2">
                        {labels[index]}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      {amount}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

SalesPaymentMethod.propTypes = {
  chartSeries: PropTypes.array,
  labels: PropTypes.array
};
