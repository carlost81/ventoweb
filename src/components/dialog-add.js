import { createCategory } from '../actions';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField } from '@mui/material';

export const DialogAdd = (props) => {

    const user = JSON.parse(localStorage.getItem('user'))
    const companyId = user.companyId;

    const {updateDialogStatus, openDialog} = props;

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
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="email"
                  label="Email Address"
                  fullWidth
                  variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => updateDialogStatus(false)}>Cancel</Button>
                <Button onClick={() => createCategory('categoryA',true,companyId)}>Crear</Button>
            </DialogActions>
        </Dialog>
    );
  };
  