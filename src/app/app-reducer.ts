export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: 'error' as string | null
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR" :
            return {...state, error: action.error}
        default:
            return state
    }
}

export const SetStatusAC = (status:RequestStatusType) => {return {type:"APP/SET-STATUS",status}as const}
export const SetErrorAC = (error:null|string) => {return{type:"APP/SET-ERROR",error}as const}

type ActionsType = SetStatusActionType | SetErrorActionType
export type SetStatusActionType = ReturnType<typeof SetStatusAC>
export type SetErrorActionType = ReturnType<typeof SetErrorAC>