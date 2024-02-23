import {
    Box,
    Card,
    Divider,
    CardContent,
    CardHeader,
    Button,
    Stack,
    Autocomplete,
    TextField,
    Typography,
    Unstable_Grid2 as Grid
  } from '@mui/material';

export const Client = (props) => {
    
    return (
        <CardContent sx={{ pt: 0 }}>
            <Grid
                container
                spacing={2}
            >
                <Grid
                xs={12}
                md={6}
                >
                <DatePicker
                    format="dd/MM/yyyy"
                    label="Fecha"
                    name="date"
                    fullWidth
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.date && formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
                    value={formik.values.date}
                />
                </Grid>
                <Grid
                xs={12}
                md={6}
                >
                <TextField
                    error={!!(formik.touched.id && formik.errors.id)}
                    fullWidth
                    helperText={formik.touched.id && formik.errors.id}
                    label="Codigo"
                    name="id"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    required
                    value={formik.values.id}
                />
                </Grid>
            </Grid>
        </CardContent>
    )
}