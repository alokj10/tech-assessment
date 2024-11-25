import { ADD_MCQ_SUCCESS, ADD_MCQ_FAIL, SELECT_MCQ,
    UPDATE_MCQ_SUCCESS, UPDATE_MCQ_FAIL, FETCH_MCQ_FAIL,
    DELETE_MCQ_SUCCESS, DELETE_MCQ_FAIL,
    FETCH_MCQ_SUCCESS, 
    OPEN_SNACKBAR, 
    CLOSE_SNACKBAR, 
    CURRENT_MCQ_FIELD_CHANGE,
    CURRENT_MCQ_FIELD_CHANGE_END, 
    MCQ_SEARCH_BEGIN, MCQ_SEARCH_END,
    MCQ_SEARCH_SUCCESS,
    CHOICE_ADDED_TO_MCQ, 
    CURRENT_ANSWER_FIELD_CHANGE
} from "../actions/McqActions";
import { FETCH_CATEGORIES_SUCCESS } from '../actions/CategoryActions'; 
import { FETCH_SKILLS_SUCCESS } from "../actions/SkillActions";

export default (state = {}, action) => {
switch(action.type) {
   case ADD_MCQ_SUCCESS:
   {
       return {
            ...state,
            error: null,
            current_mcq: { 
                id: 0,
                mcq_meta: {
                        question:'',
                        description:'',
                        category: '',
                        skill: '',
                        minimumExperience: 0,
                        maximumExperience: 10,
                        choices: []
                    }
                },
            snack_open: true,
            success_message: 'MCQ added successfully'
       }
   }
   case DELETE_MCQ_FAIL:
   case UPDATE_MCQ_FAIL:
   case ADD_MCQ_FAIL:
   {
       return {
           ...state,
           error: action.payload
       }
   }
   case SELECT_MCQ:
   {
       return {
           ...state,
           field_updated: !state.field_updated,
           editMode: true,
           current_MCQ: action.payload
       }
   }
   case UPDATE_MCQ_SUCCESS:
   {
       return {
           ...state,
           editMode: false,
           current_mcq: {
                id: 0,
                mcq_meta: { 
                    question:'',
                    description:'',
                    category: '',
                    skill: '',
                    minimumExperience: 0,
                    maximumExperience: 10,
                    choices: []
                }
           },
           success_message: 'MCQ Updated Successfully'
       }
   }
   case DELETE_MCQ_SUCCESS:
   {
       return {
           ...state,
           editMode: false,
           snack_open: true,
           current_mcq: {
                id: 0,
                mcq_meta: { 
                    question:'',
                    description:'',
                    category: '',
                    skill: '',
                    minimumExperience: 0,
                    maximumExperience: 10,
                    choices: []
                }
            },
           success_message: 'MCQ Deleted Successfully'
       }
   }
   case CURRENT_MCQ_FIELD_CHANGE:
   {
       
       return {
           ...state,
           field_updated: true,
           current_mcq: action.payload
       }
   }
   case CURRENT_MCQ_FIELD_CHANGE_END:
   {
       return {
           ...state,
           field_updated: false
       }
   }
   case CURRENT_ANSWER_FIELD_CHANGE:
   {
       return {
           ...state,
           field_updated: !state.field_updated,
           currentAnswer: action.payload
       }
   }
   case FETCH_MCQ_SUCCESS:
   {
       return {
            ...state,
            error: null,
            current_mcq: {
                id: 0,
                mcq_meta: { 
                    question:'',
                    description:'',
                    category: '',
                    skill: '',
                    minimumExperience: 0,
                    maximumExperience: 10,
                    choices: []
                }
           },
            snack_open: true,
            success_message: action.payload.message,
            mcqs: action.payload.data
       }
   }
   case FETCH_SKILLS_SUCCESS:
   {
        
        return {
            ...state,
            skills: action.payload
        }
   }
   case FETCH_CATEGORIES_SUCCESS:
   {
       
       return {
           ...state,
           error: null,
           current_mcq: {
                id: 0,
                mcq_meta: { 
                    question:'',
                    description:'',
                    category: '',
                    skill: '',
                    minimumExperience: 0,
                    maximumExperience: 10,
                    choices: []
                }
            },
           currentAnswer: {
                content: '',
                isCorrect: false
           },
           success_message: '',
           search_enabled: false,
           categories: action.payload
       }
   }
   case CHOICE_ADDED_TO_MCQ: 
   {
       return {
           ...state,
           field_updated: !state.field_updated,
           current_mcq: action.payload,
           currentAnswer: {
               content: '',
               isCorrect: false
           }
       }
   }
   case MCQ_SEARCH_BEGIN:
   {
       return {
           ...state,
           search_enabled: !state.search_enabled,
           search_term: '',
       }
   }
   case MCQ_SEARCH_END:
   {
       return {
           ...state,
           search_enabled: !state.search_enabled,
           search_term: '',
       }
   }
   case MCQ_SEARCH_SUCCESS:
   {   
       return {
           ...state,
           search_term: action.payload.searchTerm,
           filteredCategories: action.payload.filteredCategories
       }
   }
   case FETCH_MCQ_FAIL:
   {
       return {
           ...state,
           current_mcq: {
            id: 0,
            mcq_meta: { 
                    question:'',
                    description:'',
                    category: '',
                    skill: '',
                    minimumExperience: 0,
                    maximumExperience: 10,
                    choices: []
                }
            },
           error: action.payload
       }
   }
   case OPEN_SNACKBAR:
   {
       return {
           ...state,
           snack_open: true
       }
   }
   case CLOSE_SNACKBAR:
   {
       return {
           ...state,
           snack_open: false
       }
   }
   default: {
       return state;
   }
}
}