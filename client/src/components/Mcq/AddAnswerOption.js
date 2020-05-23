import React from 'react';
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import AnswerOptions from './AnswerOptions';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const AddAnswerOption = (props) => {
        let { currentAnswer, onAnswerFieldChange, onAnswerAdd, model } = props.children;
        // console.log('add option (model):');
        // console.log(model);
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container spacing={16}>
                    <Grid item xs={6} sm={6}>
                        <Typography variant="h6">Answer Choices</Typography>
                    </Grid>
                    <Grid item xs={5} sm={5}>
                    </Grid>
                    <Grid item xs={1} sm={1}>
                        <Typography variant="subtitle1" >Add Choice</Typography>
                    </Grid>
                </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div style={styles.formControl}>
                    {currentAnswer && 
                        <FormControl variant="outlined" style={styles.formControl}>
                            <TextField
                                id="outlined-name"
                                label="Description"
                                multiline
                                rows="6"
                                value={currentAnswer.content}
                                onChange={ (e) => onAnswerFieldChange(e.target.value, 'content', currentAnswer) }
                                margin="normal"
                                variant="outlined"
                            />
                        </FormControl>
                    }

                    {currentAnswer && 
                        <FormControlLabel style={styles.formControl}
                            control={
                            <Switch
                                // checked={currentAnswer.isCorrect}
                                onChange={ (e) => onAnswerFieldChange(e.target.checked, 'isCorrect', currentAnswer) }
                                value={currentAnswer.isCorrect}
                            />
                            }
                            label="Is Correct"
                        /> 
                    }
                    </div>
                    <AnswerOptions choices={model.mcq_meta.choices} />
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                <Button variant="outlined" size="small" color="primary" onClick={ () => onAnswerAdd(currentAnswer) } >
                    Add
                </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
}
export default AddAnswerOption;
const styles = {
    formControl: {
        width: '70%'
    }
}