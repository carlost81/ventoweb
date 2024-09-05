import { useCallback, useState, useEffect, useContext,forwardRef } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { RouterLink } from '../../components/router-link';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import Add from '@mui/icons-material/Add';
import {CATEGORY, PROVIDER} from '../../types'
import { DialogAdd } from '../dialog-add'
import { getCategories, getProviders, createProduct } from '../../actions'
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  CardHeader,
  Divider,
  Stack,
  Switch,
  TextField,
  Typography,
  IconButton,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { paths } from '../../paths';
import { store } from '../../config/store'



const genderOptions = [
  {
    label: 'Unisex',
    value: 'U'
  },
  {
    label: 'Mujer',
    value: 'M'
  },
  {
    label: 'Hombre',
    value: 'H'
  }
];

const initialValues = {
  name: '',
  id: '',
  cost: '',
  pvp: null,
  pvw: '',
  size: '',
  gender: 'U',
  description: '',
  category: '',
  provider: '',
  enable: true,
  submit: null
};

const validationSchema = Yup.object({
  name: Yup.string().min(2).max(50).required(),
  id: Yup.string().max(255).required(),
  cost: Yup.number().min(0),
  pvp: Yup.number().min(0).required(),
  pvw: Yup.number().min(0),
  size: Yup.string().max(50),
  gender: Yup.string().max(255),
  description: Yup.string().max(255),
  category: Yup.string().max(255),
  provider: Yup.string().max(255),
  enable: Yup.bool()
});

const NumericFormatCustom = forwardRef(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
      />
    );
  },
);

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const ProductCreateForm = (props) => {


  const [openDialog, setOpenDialog] = useState(false);
  const [openAction, setOpenAction] = useState('');
  const [indexValue, setIndexValue] = useState('');

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };



  const {
    companyId = '1'
  } = props;
  //const categories = null;
  const categories = useSelector((state) => state.categories);
  const providers = useSelector((state) => state.providers);
  const messageError = useSelector((state) => state.messageError);
  console.log('Initial state: product-create-form ', store.getState())


  useEffect(() => {

    console.log('useEffect_0',categories);
    localStorage.setItem('openDialogCategories',false);
    localStorage.setItem('openDialogProviders',false);

    if(categories == null){
      console.log('categories is null');
      getCategories({companyId:companyId});
    }
    if(providers == null){
      console.log('providers is null');
      getProviders({companyId:companyId});
    }
  }, []);


  useEffect(() => {
    console.log('useEffect_1',indexValue);
    formik.setFieldValue("category", indexValue);
    //getCategories({companyId:companyId});
  }, [categories]);


  useEffect(() => {
    console.log('indexValue::',indexValue);
    getCategories({companyId:companyId});
  }, [indexValue]);
  

  //console.log('df');
  //console.log('cat',categories);
  const [files, setFiles] = useState([]);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        console.log('submit',formik.values)
        createProduct(formik.values,companyId).then((result) =>{
          if(result){
            toast.success('Producto creado');
          }else{
            toast.error(messageError);
          }
        });
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleFilesDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleFileRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleFilesRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);


  return (
    <form
      onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader title="Edit Customer" />
        <CardContent sx={{ pt: 0 }}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Nombre"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.name}
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
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.pvp && formik.errors.pvp)}
                fullWidth
                label="Precio Venta Publico"
                name="pvp"
                onBlur={formik.handleBlur}
                //onChange={formik.handleChange}
                onChange={(event) => {
                  formik.setValues({
                    ...formik.values,
                    [event.target.name]: event.target.value,
                  });
                }}
                //type="number"
                required
                value={formik.values.pvp}
                InputProps={{
                  inputComponent: NumericFormatCustom,
                }}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.pvw && formik.errors.pvw)}
                fullWidth
                label="Precio Mayorista"
                name="pvw"
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  formik.setValues({
                    ...formik.values,
                    [event.target.name]: event.target.value,
                  });
                }}
                value={formik.values.pvw}
                InputProps={{
                  inputComponent: NumericFormatCustom,
                }}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.cost && formik.errors.cost)}
                fullWidth
                label="Costo"
                name="cost"
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  formik.setValues({
                    ...formik.values,
                    [event.target.name]: event.target.value,
                  });
                }}
                value={formik.values.cost}                
                InputProps={{
                  inputComponent: NumericFormatCustom,
                }}
              />
            </Grid>

            <Grid
              xs={12}
              md={6}
            >
              <DialogAdd updateDialogStatus={setOpenDialog} updateIndexValue={setIndexValue} openAction={openAction} openDialog={openDialog} title={openAction==CATEGORY?'Categoria':'Proveedor'}/>
              
              <TextField
                error={!!(formik.touched.gender && formik.errors.gender)}
                fullWidth
                label="Categoria"
                name="category"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                select
                  value={formik.values.category}
                  >
                    
                    <MenuItem onClick={() => {
                      setOpenAction(CATEGORY);
                      handleClickOpenDialog();
                      }} key={1} value={2} style={{ width: '100%', backgroundColor:'silver'}}>


                    <IconButton aria-label="Add" size="sm" variant="plain">
                        <Add  />
                      </IconButton>
                      Crear Categoria
                    </MenuItem>
                  { categories?.map((option) => (
                    <MenuItem
                      key={option.id}
                      value={option.id}
                    >
                      {option.name}
                    </MenuItem>
                  ))} 
              </TextField>
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.gender && formik.errors.gender)}
                fullWidth
                label="Proveedor"
                name="provider"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                select
                  value={formik.values.provider}
                  >
                    <MenuItem onClick={() => {
                      setOpenAction(PROVIDER);
                      handleClickOpenDialog();
                      }} key={1} value={2} style={{ width: '100%', backgroundColor:'silver'}}>


                    <IconButton aria-label="Add" size="sm" variant="plain">
                        <Add  />
                      </IconButton>
                      Crear Proveedor
                    </MenuItem>
                  { providers?.map((option) => (
                    <MenuItem
                      key={option.id}
                      value={option.id}
                    >
                      {option.name}
                    </MenuItem>
                  ))} 
              </TextField>
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.gender && formik.errors.gender)}
                fullWidth
                label="Genero"
                name="genero"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                select
                  value={formik.values.gender}
                  >
                  {genderOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.description && formik.errors.description)}
                fullWidth
                helperText={formik.touched.description && formik.errors.description}
                label="Descripcion"
                name="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
                  
            </Grid>
          </Grid>
          <Stack
            divider={<Divider />}
            spacing={3}
            sx={{ mt: 3 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                >
                  Activar | Desactivar producto
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Estado
                </Typography>
              </Stack>
              <Switch
                checked={formik.values.enable}
                color="primary"
                edge="start"
                name="enable"
                onChange={formik.handleChange}
                value={formik.values.enable}
              />
            </Stack>
          </Stack>
        </CardContent>
        <Stack
          direction={{
            xs: 'column',
            sm: 'row'
          }}
          flexWrap="wrap"
          spacing={3}
          sx={{ p: 3 }}
        >
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            variant="contained"
          >
            Update
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            disabled={formik.isSubmitting}
            href={paths.products}
          >
            Cancel
          </Button>
        </Stack>
      </Card>
    </form>
  );
};
