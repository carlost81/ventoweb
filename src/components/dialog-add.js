import { useState } from 'react';
import { createCategory, createProvider } from '../actions';
import toast from 'react-hot-toast';
import { CATEGORY, PROVIDER } from '../types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField } from '@mui/material';

export const DialogAdd = (props) => {

    const user = JSON.parse(localStorage.getItem('user'))
    const companyId = user.companyId;

    const {updateDialogStatus, updateIndexValue, openDialog, openAction, title} = props;
    console.log(openAction, title)

    const [textCategory, setTextCategory] = useState('');
    const [textEmail, setTextEmail] = useState('');
    const [textLocation, setTextLocation] = useState('');
    const [textProvider, setTextProvider] = useState('');
    const [textPhone, setTextPhone] = useState('');
    
    
    const contentCategory = () => {
        return (
        <DialogContent>
            <TextField
            autoFocus
            required
            margin="dense"
            id="value"
            label="categoria"
            name="value"
            onChange={(event) => {
                setTextCategory(event.target.value)
            }}
            variant="filled"
            />
        </DialogContent>
        )
        
    }

    const contentProvider = () => {
        return (
        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            id="value"
            label="email"
            name="value"
            onChange={(event) => {
                setTextEmail(event.target.value)
            }}
            fullWidth
            variant="filled"
            />
            <TextField
            autoFocus
            margin="dense"
            id="value"
            label="location"
            name="value"
            onChange={(event) => {
                setTextLocation(event.target.value)
            }}
            fullWidth
            variant="filled"
            />
            <TextField
            autoFocus
            margin="dense"
            id="value"
            label="phone"
            name="value"
            onChange={(event) => {
                setTextPhone(event.target.value)
            }}
            fullWidth
            variant="filled"
            />
            <TextField
            autoFocus
            margin="dense"
            id="value"
            label="proveedor"
            name="value"
            onChange={(event) => {
                setTextProvider(event.target.value)
            }}
            fullWidth
            variant="filled"
            />
        </DialogContent>
        )
        
    }

    return (
        <Dialog
            open={openDialog}
            onClose={() => updateDialogStatus(false)}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                  console.log('submit');
                  //close();
                },
            }}
            >
            <DialogTitle>{title}</DialogTitle>
            {openAction==CATEGORY?contentCategory():contentProvider()}
            <DialogActions>
                <Button onClick={() => updateDialogStatus(false)}>Cancelar</Button>
                <Button onClick={() => 
                    {
                        if (openAction == CATEGORY){
                            console.log(CATEGORY,textCategory,true,companyId)
                            createCategory(textCategory,true,companyId).then((result) =>{
                                console.log('r',result)
                                if(result){
                                    updateIndexValue(result);
                                    toast.success('categoría '+textCategory+' creada');
                                }
                            });
                        }else if(openAction == PROVIDER){
                            const provider = {email:textEmail,location:textLocation,name:textProvider, phone:textPhone, nit:null}
                            console.log(provider,true,companyId)
                            //email:provider?.email,location:provider?.location,nit:provider?.nit,phone:provider?.phone,name:provider?.name
                            createProvider(provider,true,companyId).then((result) =>{
                                console.log('r',result)
                                if(result){
                                    updateIndexValue(result);
                                    toast.success('proveedor '+textProvider+' creado');
                                }
                            });
                        }
                        updateDialogStatus(false)
                    }
                    }>Crear</Button>
            </DialogActions>
        </Dialog>
    );
  };
  