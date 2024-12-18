import React from 'react';
import { connect } from 'react-redux';
import AddCandidateComponent from '../components/Candidates/AddCandidate';
import {    AddCandidate, UpdateCandidate, FetchSkills,  
            CloseSnackbar, CurrentCandidateFieldChange,
            OpenSnackbar } from '../actions/CandidateActions';
import Grid from '@material-ui/core/Grid';
import SnackbarComponent from '../components/lib/SnackbarComponent';

class CandidateContainer extends React.Component {

    componentDidMount = () => {
        this.reload();
    }

    componentWillReceiveProps = (newprops, oldprops) => {
        if(newprops.success_message !== '' && newprops.success_message !== undefined) {
            console.log('newprops.success_message');
            console.log(newprops.success_message);
            this.props.OpenSnackbar();
            setTimeout(() => {
                this.props.history.push('/candidates');
            }, 1000);
        }
    }

    reload = () => {
        this.props.FetchSkills();
    }

    onAddCandidate = (model) => {
        this.props.AddCandidate(model, this.props.editMode);
    }

    render = () => {
        console.log('this.props.current_candidate');
        console.log(this.props.snack_open);
        return(
            <Grid container spacing={16}>
                <Grid item xs={12} sm={12}>
                    <AddCandidateComponent 
                        onSubmit={ (model) => this.onAddCandidate(model) }
                        model={this.props.current_candidate}
                        skills={this.props.skills}
                        editMode={this.props.editMode}
                        onFieldChange={ (val, field, model) => this.props.CurrentCandidateFieldChange(val, field, model) } 
                        />
                    
                <SnackbarComponent 
                    openSnack={this.props.snack_open} handleClose={() => this.props.CloseSnackbar()} 
                    snackMessage={"Data Saved Successfully!"} 
                    /> 
            </Grid>
            </Grid>
        );
    }
}
const mapStateToProps = state => ({
    ...state.candidateReducer
});
const mapDispatchToProps = dispatch => ({
    AddCandidate: (model, editMode) => dispatch(AddCandidate(model, editMode)),
    UpdateCandidate: (model) => dispatch(UpdateCandidate(model)),
    FetchSkills: () => dispatch(FetchSkills()),
    CloseSnackbar: () => dispatch(CloseSnackbar()),
    OpenSnackbar: () => dispatch(OpenSnackbar()),
    CurrentCandidateFieldChange: (val, field, model) => dispatch(CurrentCandidateFieldChange(val, field, model))
});
export default connect(mapStateToProps, mapDispatchToProps)(CandidateContainer);