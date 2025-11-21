import { createSlice } from '@reduxjs/toolkit'

export const utilSlice = createSlice({
  name: 'utils',
  initialState: {
    menuExpanded: true,
  },
  reducers: {
    setMenuExpansion: (state,action) => {
   
      state.menuExpanded = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setMenuExpansion } = utilSlice.actions

export default utilSlice.reducer