import { combineReducers } from 'redux';
import categoryReducer from "./categoryReducer";
import skillReducer from "./skillReducer";
import mcqReducer from "./mcqReducer";
import candidateReducer from './candidateReducer';
import adminTestReducer from './adminTestReducer';
import testConsoleReducer from './testConsoleReducer';
import inviteConsoleReducer from './inviteConsoleReducer';
import userReducer from './userReducer';
import questionSimulatorConsoleReducer from './questionSimulatorConsoleReducer';
import orgReducer from './orgReducer';
import dashboardReducer from './dashboardReducer';
import candidateConsoleReducer from './candidateConsoleReducer';
import gradeReducer from './gradeReducer';
import registeredTestReducer from './registeredTestReducer';


const appReducer = combineReducers({
    categoryReducer,
    skillReducer,
    mcqReducer,
    candidateReducer,
    adminTestReducer,
    testConsoleReducer,
    inviteConsoleReducer,
    userReducer,
    questionSimulatorConsoleReducer,
    orgReducer,
    dashboardReducer,
    candidateConsoleReducer,
    gradeReducer,
    registeredTestReducer
});

const rootReducer = (state, action) => {
    if(action.type === 'LOGOUT_CURRENT_USER') {
        state = undefined;
    }

    return appReducer(state, action);
}

export default rootReducer;