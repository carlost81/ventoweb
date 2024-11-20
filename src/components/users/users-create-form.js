import { useCallback, useState, useEffect, useContext,forwardRef } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { RouterLink } from '../../components/router-link';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import Add from '@mui/icons-material/Add';
import { getStores, createUserFirebase, editUser, createUser, getSelectedUser } from '../../actions'

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
import { useNavigate } from "react-router-dom"
import { store } from '../../config/store'



const rolOptions = [
  {
    label: 'Administrador',
    value: 'a'
  },
  {
    label: 'Vendedor',
    value: 'v'
  },
  {
    label: 'Cajero',
    value: 'c'
  }
];

const initialValues = {
  displayName: '',
  email: '',
  password: '',
  rId: 'v',
  sId: '',
  status: true,
  creator: false
};

const validationSchema = Yup.object({
  displayName: Yup.string().min(2).max(50).required(),
  email: Yup.string().max(255).required(),
  password: Yup.string().min(6).max(30).required(),
  rId: Yup.string().max(255),
  sId: Yup.string().max(255),
  status: Yup.bool()
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

export const UserCreateForm = (props) => {

  let navigate = useNavigate();

  const {
    companyId = '1'
  } = props;
  //const categories = null;
  const stores = useSelector((state) => state.stores);
  const selectedUser = useSelector((state) => state.selectedUser);
  const messageError = useSelector((state) => state.messageError);
  console.log('Initial state: user-create-form ',selectedUser)


  useEffect(() => {

    console.log('useEffect_0',stores);

    if(stores == null){
      console.log('store is null');
      getStores({companyId:companyId});
    }

    if(selectedUser){
      console.log('selectedUser:.:',selectedUser,stores)
      formik.setFieldValue('email', selectedUser?.email)
      formik.setFieldValue('displayName', selectedUser?.displayName)
      formik.setFieldValue('password', selectedUser?.password)
      formik.setFieldValue('rId', selectedUser?.rId)
      formik.setFieldValue('sId', selectedUser?.sId)
      formik.setFieldValue('status', selectedUser?.status)
      //formik.setFieldValue('store', selectedUser?.sId)
    }
  }, []);


  //console.log('df');
  //console.log('cat',categories);
  const [files, setFiles] = useState([]);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request

        //console.log('submit',formik.values)
        if(selectedUser){
          const user = {...formik.values}
          console.log('edit', user, selectedUser)
          editUser(selectedUser.id,user).then((result) =>{
            console.log('result', result,selectedUser.id)
            if(result.status){
              toast.success('Usuario actualizado');
              getSelectedUser(null);
              navigate(paths.users)
            } else{
              toast.error(result.msg);
            }
          })
        }else{
          createUserFirebase(formik.values,companyId).then((result) =>{
            if(result.status){
              const user= {...formik.values,uid:result.msg};
              console.log('user1::',user)
              createUser({...formik.values,uid:result.msg},companyId).then((result) =>{
                if(result.status){
                  toast.success('Usuario creado');
                  navigate(paths.users)
                } else{
                  toast.error(result.msg);
                }
              })
            }else{
              toast.error(result.msg);
            }
          });
        }
      } catch (err) {
        console.error('err1:',err);
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
        <CardHeader title={(selectedUser?'Editar':'Crear')+' Usuario'} />
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
                error={!!(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                disabled={selectedUser?true:false}
                required
                value={formik.values.email}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                label="Password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                required
                value={formik.values.password}
                disabled={selectedUser?true:false}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.displayName && formik.errors.displayName)}
                fullWidth
                helperText={formik.touched.displayName && formik.errors.displayName}
                label="Nombre"
                name="displayName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.displayName}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                error={!!(formik.touched.rId && formik.errors.rId)}
                fullWidth
                label="Rol"
                name="rId"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                select
                  value={formik.values.rId}
                  >
                  {rolOptions.map((option) => (
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
                fullWidth
                label="Tienda por defecto"
                name="sId"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                /*defaultValue ={() => {
                  let store = stores?.find((row) => row.id === selectedUser?.sId);
                  console.log('LOV store',stores,selectedUser?.sId,store)
                  return {'id':store?.id,'name':store?.name}
                }}*/
                required
                defaultValue={selectedUser?.sId}
                select
                  value={formik.values.store}
                  >

                  { stores?.map((option) => (
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
                  Activar | Desactivar Usuario
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Estado
                </Typography>
              </Stack>
              <Switch
                checked={formik.values.status}
                color="primary"
                edge="start"
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status}
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
            onClick={() => {
              navigate(paths.users)
            }}
            disabled={formik.isSubmitting}
            //href={paths.sales}
          >
            Cancelar
          </Button>
        </Stack>
      </Card>
    </form>
  );
};
