import React from 'react';
import { connect } from 'react-redux';
import AddMcqComponent from '../components/Mcq/AddMcq';
import {    AddMcq, FetchMcqs, UpdateMcq, FetchCategories, FetchSkills, 
            CloseSnackbar, CurrentMcqFieldChange, CurrentAnswerFieldChange,
            OpenSnackbar, SelectMcq, AddAnswerChoice,
            BeginSearch, SearchMcq } from '../actions/McqActions';
import Grid from '@material-ui/core/Grid';
import SnackbarComponent from '../components/lib/SnackbarComponent';

class McqContainer extends React.Component {

    componentDidMount = () => {
        this.reload();
    }

    componentWillUpdate = () => {
        if(this.props.success_message !== '') {
            this.props.FetchCategories();
        }
    }

    componentWillReceiveProps = (newprops, oldprops) => {
        // console.log('mcq container: receiving props');
        if(newprops.success_message !== '') {
            setTimeout(() => {
                this.props.history.push('/mcqs');
            }, 1000);
        }
    }

    reload = () => {
        this.props.FetchCategories();
        this.props.FetchSkills();
    }

    onAddMcq = (model) => {
        this.props.AddMcq(model, this.props.editMode);
    }

    render = () => {
        console.log('mcq container render snack open: ' + this.props.snack_open);
        return(
            <Grid container spacing={16}>
                <Grid item xs={12} sm={12}>
                    <AddMcqComponent 
                        onSubmit={ (model) => this.onAddMcq(model) }
                        onAnswerAdd={ (model) => this.props.AddAnswerChoice(model, this.props.current_mcq) }
                        model={this.props.current_mcq}
                        categories={this.props.categories}
                        skills={this.props.skills}
                        currentAnswer={this.props.currentAnswer}
                        editMode={this.props.editMode}
                        onFieldChange={ (val, field, model) => this.props.CurrentMcqFieldChange(val, field, model) } 
                        onAnswerFieldChange={ (val, field, model) => this.props.CurrentAnswerFieldChange(val, field, model) } 
                        />
                    
                <SnackbarComponent 
                    openSnack={this.props.snack_open} handleClose={() => this.props.CloseSnackbar()} 
                    snackMessage={"Data Saved Successfully!"} 
                                    // "Category Updated Successfully" :    
                                    // "Category Added Successfully!"}
                    /> 
            </Grid>
            </Grid>
        );
    }
}
const mapStateToProps = state => ({
    ...state.mcqReducer
});
const mapDispatchToProps = dispatch => ({
    AddMcq: (model, editMode) => dispatch(AddMcq(model, editMode)),
    AddAnswerChoice: (model, mcqModel) => dispatch(AddAnswerChoice(model, mcqModel)),
    UpdateMcq: (model) => dispatch(UpdateMcq(model)),
    SelectMcq: (model) => dispatch(SelectMcq(model)),
    FetchCategories: () => dispatch(FetchCategories()),
    FetchSkills: () => dispatch(FetchSkills()),
    FetchMcqs: () => dispatch(FetchMcqs()),
    CloseSnackbar: () => dispatch(CloseSnackbar()),
    OpenSnackbar: () => dispatch(OpenSnackbar()),
    BeginSearch: () => dispatch(BeginSearch()),
    SearchMcq: (searchTerm, mcqList) => dispatch(SearchMcq(searchTerm, mcqList)),
    CurrentMcqFieldChange: (val, field, model) => dispatch(CurrentMcqFieldChange(val, field, model)),
    CurrentAnswerFieldChange: (val, field, model) => dispatch(CurrentAnswerFieldChange(val, field, model))
});
export default connect(mapStateToProps, mapDispatchToProps)(McqContainer);