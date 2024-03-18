import {
    LOAD_EXPENSES,
    LOAD_CATEGORIES,
    LOAD_ACCOUNTS,
    LOAD_MESSAGES,
    ADD_ACCOUNT,
    ADD_CATEGORY,
    ADD_EXPENSE,
    EDIT_ACCOUNT,
    EDIT_CATEGORY,
    EDIT_EXPENSE,
    DELETE_ACCOUNT,
    DELETE_CATEGORY,
    DELETE_EXPENSE
} from "./actions";


const initialState = {
    expenses: [],
    categories: [],
    accounts: [],
    messages: [],
    budget: 0
};

const expenseReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_MESSAGES:
            return {
                ...state,
                messages: [...messages, action.payload]
            };
        case LOAD_EXPENSES:
            return {
                ...state,
                expenses: [...state.expenses]
            };
        case LOAD_CATEGORIES:
            return {
                ...state,
                categories: [...state.categories]
            };
        case LOAD_ACCOUNTS:
            return {
                ...state,
                accounts: [{
                    id: 1,
                    name: 'SBI SAVINGS',
                    balance: '2000'
                },{
                    id: 2,
                    name: 'HDFC ACCOUNT',
                    limit: '10000'
                }]
            };
        case ADD_EXPENSE:
            return {
                ...state,
                expenses: [...state.expenses, action.payload]
            };
        case ADD_CATEGORY:
            return {
                ...state,
                categories: [...state.categories, action.payload]
            };
        case ADD_CATEGORY:
            return {
                ...state,
                accounts: [...state.accounts, action.payload]
            };
        default:
            return state;
    }
}
export default expenseReducer;