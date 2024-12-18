import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const experienceLevel = [
    0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20
];

class SelectExperience extends Component{

    state = {
        open: false,
        min: '',
    };
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        min: 0,
        max: 10
      };
    }

    // handleChange = (name, event) => {
      handleChange = name => event => {
        // this.setState({ [name]: Number(event.target.value) });
        switch(name)
        {
          case 'min':
          {
            this.setState({
              min: event.target.value
            });
            break;
          }
          case 'max':
          {
            this.setState({
              max: event.target.value
            });
            break;
          }
          default:{}
        }
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSubmit = () => {
      console.log('submit called');
      this.handleClose();
      this.props.onSubmitExperience(this.state.min, this.state.max);
    }

    render = () => {
    return (
        <div>
        <Button variant="outlined" onClick={this.handleClickOpen}>Experience Level: {this.state.min} - {this.state.max}</Button>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>Select Experience Level</DialogTitle>
          <DialogContent>
            <form >
                <br></br>
                <br></br>
              <FormControl style={styles.formControl} variant="outlined" >
                <InputLabel htmlFor="min-simple">Minimum</InputLabel>
                <Select
                  value={this.state.min}
                  onChange={this.handleChange('min')}
                  input={<Input id="min-simple" />}
                >
                {experienceLevel.map((item, index) => {
                  return <MenuItem key={index} value={item}>{item}</MenuItem>
                })}
                </Select>
              </FormControl>
              <FormControl style={styles.formControl} variant="outlined" >
                <InputLabel htmlFor="max-simple">Maximum</InputLabel>
                <Select
                  value={this.state.max}
                  onChange={this.handleChange('max')}
                  input={<Input id="max-simple" />}
                >
                {experienceLevel.map((item, index) => {
                  return <MenuItem key={index} value={item}>{item}</MenuItem>
                })}
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
    }
}
const styles = {
    
      formControl: {
        width:"45%", 
        marginLeft:"5%"
      }
    
};
export default SelectExperience;