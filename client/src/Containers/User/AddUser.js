import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader, DialogContent, Dialog, DialogTitle, DialogActions, Divider } from '@material-ui/core';
import { MenuItem, OutlinedInput, Select, InputLabel, IconButton } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import LoadingComponent from '../../components/lib/LoadingComponent';
import { Close  } from '@material-ui/icons';
import AuthHelper from '../../AuthHelper';
import config from '../../config';

class AddUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }
        
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSubmit = () => {
      this.props.onSubmit(this.props.model);
      this.handleClose();
    }
    
    render = () => {
        let { model, orgs, UserRoles } = this.props;
        return (
            <div>
            {!model && <LoadingComponent /> } 
            {model && 
            <Card>   
                    <Button variant="contained" color="primary" onClick={this.handleClickOpen}>Add User</Button>
                <Dialog
                fullWidth={true}
                open={this.state.open}
                onClose={this.handleClose}
                >
                <DialogTitle onClose={this.handleClose}>Create New User</DialogTitle>
                <Divider />
                <DialogContent style={{padding: '4%'}}>
                    <form  noValidate autoComplete="off">
                                <FormControl variant="standard" style={styles.formControl}>
                                    <InputLabel htmlFor="outlined-role-simple">
                                        Role
                                    </InputLabel>
                                    <Select
                                        onChange={(e) => this.props.onFieldChange(e.target.value, 'role', model)}
                                        value={model.user_meta.role}
                                        input={
                                            <OutlinedInput
                                                labelWidth={85}
                                                name="role"
                                                id="outlined-role-simple"
                                            />
                                        }>
                                        {UserRoles && UserRoles.length > 0 &&
                                            UserRoles.map((item, index) => {
                                            return (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" style={styles.formControl}>
                                    <InputLabel htmlFor="outlined-org-simple">
                                        Organization
                                    </InputLabel>
                                    <Select
                                        onChange={(e) => this.props.onFieldChange(e.target.value, 'orgId', model)}
                                        value={model.user_meta.orgId}
                                        input={
                                            <OutlinedInput
                                                labelWidth={85}
                                                name="org"
                                                id="outlined-org-simple"
                                            />
                                        }>
                                        {orgs && orgs.length > 0 &&
                                            orgs.map((item, index) => {
                                            return (
                                                <MenuItem key={index} value={item.id}>{item.org_meta.name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            <FormControl variant="outlined" style={styles.formControl}>
                                <TextField
                                    id="outlined-email"
                                    label="Email Id"
                                    className={styles.dense}
                                    value={model.user_meta.emailId}
                                    onChange={(e) => this.props.onFieldChange(e.target.value, 'emailId', model)}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </FormControl>
                            <FormControl variant="outlined" style={styles.formControl}>
                                <TextField
                                    id="outlined-name"
                                    label="Full Name"
                                    className={styles.dense}
                                    value={model.user_meta.name}
                                    onChange={(e) => this.props.onFieldChange(e.target.value, 'name', model)}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </FormControl>
                    </form>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button variant="contained" size="large" color="primary"
                                        onClick={ () => this.handleSubmit(this.props.model)}>
                            Create User
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>}
        
            </div>
        );
    }
}
const styles = {
    formControl: {
        width: '80%',
        marginBottom: '4%'
    },
    avatar: {
        backgroundColor: '#555'
    }
};
export default AddUser;