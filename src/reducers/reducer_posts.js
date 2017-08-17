import _ from 'lodash'
import { FETCH_POSTS, FETCH_POST, DELETE_POST } from '../actions'

export default function(state = {}, action) {
  switch (action.type) {
    case DELETE_POST:
      // using _.omit here to remove the deleted post from local state
      // this does not modify the current state directly, but returns a new one instead
      return _.omit(state, action.payload)     
    case FETCH_POST:
      //ES5 syntax
      //const post = action.payload.data
      //const newState = { ...state } // take the previously fetched posts from state and append them into the the object
      //newState[post.id] = post
      //return newState

      // the same in sexy ES6 syntax ;)
      // [action.payload.data] inside object means "key interpolation" 
      // => make a new key in object using this value
      return { ...state, [action.payload.data.id]: action.payload.data }
    case FETCH_POSTS:
      return _.mapKeys(action.payload.data, 'id')
    default:
      return state
  }
}
