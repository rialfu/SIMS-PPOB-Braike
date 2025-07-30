import { configureStore } from "@reduxjs/toolkit"
import {auth} from './auth-reducer'


export const store = configureStore({
    reducer:{ auth }
})
