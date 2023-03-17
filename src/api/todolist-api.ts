import axios from "axios";
import {TaskType} from "../state/tasks-reducer";


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '7927a783-5afd-4ad3-9f9c-1cf089c72577'
    }
})

export const todoListApi = {
    getTodoList() {
        return instance.get<GetTodoListType[]>('todo-lists')
    },
    createTodoList(title: string) {
        return instance.post<TodoListResponseType<{item:GetTodoListType}>>('todo-lists', {title})
    },
    deleteTodoList(id: string) {
        return instance.delete<TodoListResponseType>(`todo-lists/${id}`)
    },
    updateTodoList(id: string, title: string) {
        return instance.put<TodoListResponseType>(`todo-lists/${id}`, {title})
    },

    // -------------------------------------------------tasks

    getTasks(todoID: string) {
        return instance.get<GetTaskResponseType>(`todo-lists/${todoID}/tasks`)
    },
    createTasks(todoID: string, title: string) {

        return instance.post<ResponseTasksType<{item:TaskType}>>(`todo-lists/${todoID}/tasks`, {title})
    },
    updateTasks(todoID: string, taskID: string, title: string) {
        return instance.put<ResponseTasksType<{item:TaskType}>>(`todo-lists/${todoID}/tasks/${taskID}`, {title})
    },
    deleteTasks(todoID: string, taskID: string) {
        return instance.delete<ResponseTasksType>(`todo-lists/${todoID}/tasks/${taskID}`)
    }

}


// --------------------------------------------------- todos type

export type GetTodoListType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

type TodoListResponseType<T = {}> = {
    resultCode: number
    messages: string[]
    data: T
}

// --------------------------------------------------- tasks type


export type GetTaskResponseType = {
    items: TaskType[];
    totalCount: number;
    error?: any;
}
export type ResponseTasksType<T={}> = {
    data: T
    fieldsErrors: []
    messages: string[]
    resultCode: number
}


