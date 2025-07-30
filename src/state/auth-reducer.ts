import { createSlice, } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    email: null,
    first_name: null,
    last_name: null,
    profile:null,
    balance:0,
    see:false,
  },
  reducers: {
    login: (state, action) => {
      return  {...state, ...action.payload}
    },
    updateProfile:(state, action) => {
      return { ...state, ...action.payload, }
    },
    updateSaldo:(state,action)=>{
      return {...state, balance:action.payload}
    },
    updateSee:(state, action)=>{
      return {...state, see:action.payload}
    },
    logout: state => {
      return {
        token: null,
        email: null,
        first_name: null,
        last_name: null,
        profile:null,
        balance:0,
        see:false,
      }
    }
  }
})
export const {login, updateProfile, updateSaldo, updateSee, logout} = authSlice.actions
export const auth = authSlice.reducer;

// export type RootState = ReturnType<typeof storeAuth.getState>
// export type AppDispatch = typeof storeAuth.getState