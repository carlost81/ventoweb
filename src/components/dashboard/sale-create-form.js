import { useCallback, useState, useEffect, useContext, forwardRef } from 'react';
//import  DataContext from "../../context/ventoData/dataContext";
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { RouterLink } from '../../components/router-link';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { ProductsBySale } from '../dashboard/products-by-sale'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import IconButton from '@mui/joy/IconButton';
import moment from "moment";
import { NumericFormat } from 'react-number-format';
import { getCategories, getStores, getUsers, getClients, createSale } from '../../actions'
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
  Unstable_Grid2 as Grid
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { paths } from '../../paths';
import { store } from '../../config/store'



const paymentOptions = [
  {
    label: 'Contado',
    value: 'C'
  },
  {
    label: 'Transferencia',
    value: 'T'
  }
];

const initialValues = {
  d: new Date(),
  s: '',//store,
  sId: '',//store Id
  v: '',//vendedor
  vId: '',
  fId: '',
  pc: 'T',
  di: '',
  cd:'',
  cn:'',
  ce:'',
  cp:'',
  ca:'',
  cid:'',
  submit: null
};

const validationSchema = Yup.object({
  d: Yup.date().required('debe seleccionar una fecha'),
  s: Yup.string().max(255).required('debe seleccionar un almacen'),
  sId: Yup.string().max(255),
  v: Yup.string().max(255).required('debe seleccionar un vendedor'),
  vId: Yup.string().max(255),
  fId: Yup.string().max(255),
  pc: Yup.string().max(1),
  di: Yup.number(),
  cd: Yup.string().max(255),
  cn: Yup.string().max(255),
  ce: Yup.string().email('Ingrese un email valido'),
  cp: Yup.string().max(25),
  cid: Yup.string().max(25),
});

const filter = createFilterOptions();

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

export const SaleCreateForm = (props) => {
  const { companyId = '1',tax = 0.19 } = props;
  //const categories = null;
  const stores = useSelector((state) => state.stores);
  const salesmen = useSelector((state) => state.users);
  const categories = useSelector((state) => state.categories);
  const messageError = useSelector((state) => state.messageError);
  const productsSale = useSelector((state) => state.productsSale);
  const clients = useSelector((state) => state.clients);
  /*const { 
    getCategories,
    categories
  } = useContext(DataContext);*/
  const [value, setValue] = useState('');

/*   const {
    values: { clientEmail },
    setFieldValue
  } = useFormikContext();
  const [field, meta] = useField(props); */

  useEffect(() => {

    if(stores == null){
      console.log('store is null');
      getStores({companyId:companyId});
    }
    if(salesmen == null){
      console.log('salesmen is null');
      getUsers({companyId:companyId});
    }
    if(categories == null){
      console.log('categories is null');
      getCategories({companyId:companyId});
    }
    if(clients == null){
      console.log('clients is null');
      getClients({companyId:companyId});
    }
  }, []);


  //console.log('df');
  const [files, setFiles] = useState([]);
  const formik = useFormik({
    enableReinitialize:true,
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        const d=moment(new Date(formik.values.d)).format("YYYY-MM-DD");
        let total = Array.from(productsSale.products).reduce((acc,item) => Number(acc)+Number(item.pvp*item.c),0);
        let costs = Array.from(productsSale.products).reduce((acc,item) => Number(acc)+Number(item.cost*item.c),0);
        const summit = {...formik.values,d,summary:{costs,sub:total*(1-tax),tax:total*tax,total},tt:total-formik.values.di,productsSale:productsSale.products}
        console.log('click OnSubmit')
        createSale(summit,companyId).then((result) =>{
          console.log('result', result)
          if(!result){
            toast.success('Venta registrada correctamente');
          }else{
            toast.error('Error al crear la venta '+result);
            helpers.setErrors({ submit: result });
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

/*   const {values} = useFormikContext();
  useEffect(() => {
    values.clientEmail='hola'
  },[values]); */

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

  const handleClick = () => {
    /*const d=moment(new Date(formik.values.d)).format("YYYY-MM-DD");
    let total = Array.from(productsSale.products).reduce((acc,item) => Number(acc)+Number(item.pvp*item.c),0);
    let costs = Array.from(productsSale.products).reduce((acc,item) => Number(acc)+Number(item.cost*item.c),0);
    console.log('productsSale::',total,costs,productsSale.products)*/
    //const a = {...formik.values,d,summary:{costs,sub:total*(1-tax),tax:total*tax,total},tt:total-formik.values.di,productsSale:productsSale.products}
    console.log('handleClick')
  }

  const onDocClientChange = (doc) => {
    console.log('ob',doc)
    const found = clients.find(element => {
      return element.d === doc;
    });
    formik.setFieldValue('cd', doc)
    if(found){
      formik.setFieldValue('ce', found.e)
      formik.setFieldValue('cn', found.n)
      formik.setFieldValue('cp', found.p)
      formik.setFieldValue('ca', found.a)
      formik.setFieldValue('cid', found.id)
    }else{
      formik.setFieldValue('ce', '')
      formik.setFieldValue('cn', '')
      formik.setFieldValue('cp', '')
      formik.setFieldValue('ca', '')
      formik.setFieldValue('cid', '')
    }
  }

  return (
    <form
      onSubmit={formik.handleSubmit}>
        <CardHeader title="Informacion General" />
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
                format="yyyy-MM-dd"
                label="Fecha"
                name="d"
                onBlur={formik.handleBlur}
                //onChange={formik.handleChange}

                onChange={(value) => {

                  //const originalDate = moment(new Date(value)).format("YYYY-MM-DD");
                  //moment(this.props.d,'YYYY-MM-DD').toDate()
                  console.log(moment(new Date(value)).format("YYYY-MM-DD"), moment(value,'YYYY-MM-DD').toDate().toLocaleDateString());
                  formik.setFieldValue("d", value !== null ? value : initialValues.d);
                }}
                error={!!(formik.touched.d && formik.errors.d)}
                helperText={formik.touched.d && formik.errors.d}
                value={formik.values.d}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.fId && formik.errors.fId)}
                fullWidth
                helperText={formik.touched.fId && formik.errors.fId}
                label="Factura"
                name="fId"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.fId}
              />
            </Grid>

            <Grid
              xs={12}
              md={6}
            >
              <Autocomplete
                options={stores}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                label="Almacen"
                name="s"
                onChange={(e, value) => {
                  console.log(value);
                  formik.setFieldValue("sId", value !== null ? value.id : initialValues.sId);
                  formik.setFieldValue("s", value !== null ? value.name : initialValues.s);
                }}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => 
                  <TextField 
                  {...params}
                  error={!!(formik.touched.s && formik.errors.s)}
                  helperText={formik.touched.s && formik.errors.s}
                  label="Tienda" />}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <Autocomplete
                options={salesmen}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                label="Vendedor"
                name="v"
                onChange={(e, value) => {
                  console.log(value);
                  formik.setFieldValue("vId", value !== null ? value.id : initialValues.vId);
                  formik.setFieldValue("v", value !== null ? value.displayName : initialValues.v);
                }}
                getOptionLabel={(option) => option.displayName}
                renderInput={(params) => <TextField {...params} label="Vendedor" />}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.pc && formik.errors.pc)}
                fullWidth
                label="Modo de Pago"
                name="pc"
                onBlur={formik.handleBlur}
                onChange={(e, value) => {
                  console.log('v',value);
                  formik.setFieldValue("pc", value !== null ? value.props.value : initialValues.pc);
                }}
                select
                  value={formik.values.pc}
                  >
                  {paymentOptions.map((option) => (
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
                error={!!(formik.touched.di && formik.errors.di)}
                fullWidth
                helperText={formik.touched.di && formik.errors.di}
                label="Descuento"
                name="di"
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  formik.setValues({
                    ...formik.values,
                    [event.target.name]: event.target.value,
                  });
                }}
                value={formik.values.di}
                InputProps={{
                  inputComponent: NumericFormatCustom,
                }}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
                  
            </Grid>
          </Grid>
          <Typography
            gutterBottom
            variant="subtitle1"
          >
            Cliente 
          </Typography>
          <Grid
            container
            spacing={2}
          >
            <Grid
              xs={12}
              md={6}
            >
              <Autocomplete
                    value={formik.values.cd}
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        onDocClientChange(newValue)
                      } else if (newValue && newValue.inputValue) {
                        setValue({
                          d: newValue.inputValue,
                        });
                      } else {
                        onDocClientChange(newValue?.d)
                      }
                    }}
                    id="free-solo-with-text-demo"
                    onBlur={(e) => {
                      onDocClientChange(e.target.value)
                    }}
                    options={clients}
                    getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === 'string') {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option.d;
                    }}
                    renderOption={(props, option) => <li {...props}>{option.d}</li>}
                    freeSolo
                    //disableClearable
                    renderInput={(params) => (
                      <TextField {...params} label="documento"  InputProps={{
                        ...params.InputProps,
                        type: 'search',
                      }}/>
                    )}
                  />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.ce && formik.errors.ce)}
                fullWidth
                //helperText={formik.touched.ce && formik.errors.ce}
                label="Email"
                name="ce"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.ce}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.cn && formik.errors.cn)}
                fullWidth
                //helperText={formik.touched.cn && formik.errors.cn}
                label="Nombre"
                name="cn"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.cn}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.cp && formik.errors.cp)}
                fullWidth
                //helperText={formik.touched.clientEmail && formik.errors.clientEmail}
                label="Telefono"
                name="cp"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.cp}
              />
            </Grid>
          </Grid>

          <Stack
            divider={<Divider />}
            spacing={3}
            sx={{ mt: 3 }}
          >

              <Stack spacing={1}>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                >
                  Agregar Productos 
                </Typography>
                <ProductsBySale {...props} 
                  di={formik.values.di}/>
              </Stack>
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
            </Stack>
          </Stack>
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
            onClick={handleClick}
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
      </CardContent>
    </form>
  );
};
