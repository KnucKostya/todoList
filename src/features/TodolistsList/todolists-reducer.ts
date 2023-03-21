import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {
    RequestStatusType,
    SetErrorAC,
    SetErrorActionType,
    SetStatusAC,
    SetStatusActionType
} from "../../app/app-reducer";
import {AxiosError} from "axios";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case "CHANGE-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)

export const changeEntityStatusAC = (id: string, status: RequestStatusType) => {
    return {type: "CHANGE-ENTITY-STATUS", id, status} as const
}

// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(SetStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then((res) => {
                if(res) {
                    dispatch(setTodolistsAC(res.data))
                    dispatch(SetStatusAC('succeeded'))
                }
                else{
                    dispatch(SetStatusAC('failed'))
                    dispatch(SetErrorAC('some error'))
                }
            })
            .catch(err=>{
                dispatch(SetErrorAC(err.message))
            })

    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(SetStatusAC('loading'))
        dispatch(changeEntityStatusAC(todolistId, 'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                if(res.data.resultCode === 0){
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(SetStatusAC('succeeded'))
                    dispatch(changeEntityStatusAC(todolistId, 'idle'))
                }else{
                    dispatch(SetStatusAC('failed'))
                    dispatch(SetErrorAC('some error'))
                }
            })
            .catch((err: AxiosError) => {
                    dispatch(SetStatusAC('failed'))
                    dispatch(changeEntityStatusAC(todolistId, 'failed'))
                    dispatch(SetErrorAC(err.message))
                })
            }
    }

export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(SetStatusAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if(res.data.resultCode === 0){
                    dispatch(addTodolistAC(res.data.data.item))
                }else{
                    if (res.data.messages[0]){
                        dispatch(SetErrorAC(res.data.messages[0]))
                    }else{
                        dispatch(SetStatusAC('failed'))
                        dispatch(SetErrorAC('some error'))
                    }
                }
                dispatch(SetStatusAC('succeeded'))
            })
            .catch((err:AxiosError)=>{
                dispatch(SetErrorAC(err.message))
            })
            .finally(()=>{
                dispatch(SetStatusAC('succeeded'))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(SetStatusAC('loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                if(res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(id, title))
                    dispatch(SetStatusAC('succeeded'))
                }else{
                    if (res.data.messages[0]){
                        dispatch(SetErrorAC(res.data.messages[0]))
                    }else{
                        dispatch(SetStatusAC('failed'))
                        dispatch(SetErrorAC('some error'))
            }}}
            )
            .catch(err=>{
                if(err){
                    dispatch(SetStatusAC('failed'))
                    dispatch(SetErrorAC(err.data.messages[0]))
                }else{
                    dispatch(SetStatusAC('failed'))
                    dispatch(SetErrorAC('some error'))
                }
            })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | SetStatusActionType
    | ReturnType<typeof changeEntityStatusAC>
    | SetErrorActionType

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}