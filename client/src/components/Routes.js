import React from 'react';
import AddCategoryComponent from './Categories/AddCategory';
import AddCandidateComponent from './Candidates/AddCandidate';
import DashboardComponent from './Dashboard';
import UsersComponent from './Users';
import { Route } from 'react-router-dom'
import CategoriesContainer from '../Containers/CategoryContainer';
import SkillsContainer from '../Containers/SkillContainer';
import McqContainer from '../Containers/McqContainer';
import CandidatesContainer from '../Containers/CandidateContainer';
import McqList from '../components/Mcq/McqList';
import CandidateList from '../components/Candidates/CandidateList';

const Routes = (props) => {
    return (
        <div>
            <Route exact path="/" component={DashboardComponent} />
            <Route path="/dashboard" component={DashboardComponent} />
            <Route path="/mcqs" component={McqList} />
            <Route path="/addMcq" component={McqContainer} />
            <Route path="/categories" component={CategoriesContainer} />
            <Route path="/skills" component={SkillsContainer} />
            <Route path="/addCategory" component={AddCategoryComponent} />
            <Route path="/candidates" component={CandidateList} />
            <Route path="/addCandidate" component={CandidatesContainer} />
            <Route path="/users" component={UsersComponent} />
        </div>
    );
}
export default Routes;