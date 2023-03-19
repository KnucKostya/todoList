import {TasksStateType} from '../App';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodosActionType} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    todolistId: string
    task: TaskType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType | SetTodosActionType | SetTasksType

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {

        case "SET-TASKS": {
            return {...state, [action.todoID]: action.tasks}
        }

        case "SET-TODOLIST": {
            let stateCopy = {...state}
            action.todoLists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }

        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            return {...state, [action.todolistId]: [action.task, ...state[action.todolistId]]}
        }
        case 'CHANGE-TASK-STATUS': {
            return {...state,[action.todolistId]:state[action.todolistId]
                    .map(t=>t.id===action.taskId?{...t,status:action.status}: t)}
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType, todolistId: string): AddTaskActionType => {
    return {type: 'ADD-TASK', task, todolistId}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}
export const setTasksAC = (todoID: string, tasks: TaskType[]) => {
    return {type: 'SET-TASKS', todoID, tasks} as const
}
export type SetTasksType = ReturnType<typeof setTasksAC>

export const getTasksTC = (todoID: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todoID)
        .then(res => {
            dispatch(setTasksAC(todoID, res.data.items))
        })
}
export const removeTasksTC = (todoID: string, taskID: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todoID, taskID)
        .then(res => {
            dispatch(removeTaskAC(taskID, todoID))
        })
}
export const createTaskTC = (todoID: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(todoID, title)
        .then(res => {
            dispatch(addTaskAC(res.data.data.item, todoID))
        })
}

export const updateTaskTitleTC = (todoID:string,taskID:string,title:string) => (dispatch: Dispatch,getState:()=>AppRootStateType) => {
    let task = getState().tasks[todoID].find(t=>t.id===taskID)
    if(task) {
        const model: UpdateTaskModelType = {
            title:title,
            deadline: task.deadline,
            description: task.description,
            startDate: task.startDate,
            priority: task.priority,
            status: task.status
        }
        todolistsAPI.updateTask(todoID, taskID, model)
            .then(response=>{
                dispatch(changeTaskTitleAC(taskID,title,todoID))
            })
    }
}

export const updateTaskStatusTC = (taskId: string, status: TaskStatuses, todolistId: string) => (dispatch: Dispatch,getState:()=>AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t=>t.id===taskId)
    if(task){
        const model:UpdateTaskModelType = {
            title: task.title,
            deadline:task.deadline,
            description:task.description,
            startDate:task.startDate,
            priority:task.priority,
            status:status
        }
        todolistsAPI.updateTask(todolistId,taskId,model)
            .then(res => {
                dispatch(changeTaskStatusAC(taskId,status,todolistId))
            })
    }
}

//

