import {SetErrorAC, SetStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";

export const handleServerNetworkError = (dispatch:Dispatch,error:{message:string}) => {
    dispatch(SetStatusAC('failed'))
    dispatch(SetErrorAC(error.message))
}