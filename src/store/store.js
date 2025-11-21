import { configureStore } from '@reduxjs/toolkit'
import utilReducer from './slices/utilSlice'
import authReducer from './slices/authSlice'
import notesReducer from './slices/notesSlice'
import todosReducer from './slices/todosSlice'
import homeReducer from './slices/homeSlice'
export default configureStore({
  reducer: {
    utils: utilReducer,
    auth: authReducer,
    notes: notesReducer,
    todos: todosReducer,
    home: homeReducer
  },
})