import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form' /* formReducer is required for redux-form to work */
import PostsReducer from './reducer_posts'

const rootReducer = combineReducers({
  posts: PostsReducer,
  form: formReducer /* redux-form expects the key "form" to be in redux state */
});

export default rootReducer;
