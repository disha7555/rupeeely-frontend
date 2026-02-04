import {createSlice} from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name:"theme",
    initialState:{mode:"light"},
        reducers:{
            togglestheme(state){
                state.mode = state.mode === "light" ? "dark" : "light"
            },
        },
    
})  
export const {togglestheme} = themeSlice.actions;
export default themeSlice.reducer;