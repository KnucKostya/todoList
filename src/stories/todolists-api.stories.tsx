import React, {useEffect, useState} from 'react'
import {todoListApi} from "../api/todolist-api";

export default {
    title: 'API'
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todoListApi.getTodoList()
            .then(response => {
                setState(response.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todoName = 'React&Redux'
        todoListApi.createTodoList(todoName)
            .then(response => {
                setState(response.data)
            })

    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoID = '81c30a67-0a1e-4545-8999-74cce761f7ec'
        todoListApi.deleteTodoList(todoID)
            .then(response => {
                    setState(response.data)
                }
            )
            .catch(() => {
                console.log('err')
            })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const id = '6df64bba-af89-485e-bae3-335c32c8dcde'
        let todoName = 'React$&&&&&&&&CSS'
        todoListApi.updateTodoList(id, todoName)
            .then(response => {
                setState(response.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const GetTasksForTodo = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {

        const todoID = '0fc92341-7ee6-411a-a53f-5aa8fadcfda1'
        todoListApi.getTasks(todoID)
            .then(response => {
                setState(response.data)
            })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTasks = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todoID = '0fc92341-7ee6-411a-a53f-5aa8fadcfda1'
        const title = 'mayon ME'
        todoListApi.createTasks(todoID,title)
            .then(response => {
                console.log(response)
                setState(response.data.data.item.title)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTasks = () => {
    const [state, setState] = useState<any>(null)

    useEffect(()=>{
        const todoID = '0fc92341-7ee6-411a-a53f-5aa8fadcfda1'
        const taskID = '86f427d1-73d1-4744-aed9-3ddccc9444e5'
        const title = 'mekstriperskiiiiii'

        todoListApi.updateTasks(todoID,taskID,title)
            .then(response=>{
                setState(response.data)
            })
    },[])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTasks = () => {
    useEffect(()=>{
        const todoID = '0fc92341-7ee6-411a-a53f-5aa8fadcfda1'
        const taskID = '86f427d1-73d1-4744-aed9-3ddccc9444e5'

        todoListApi.deleteTasks(todoID,taskID)
            .then(response=>{
                setState(response)
            })
    },[])

    const [state, setState] = useState<any>(null)

    return <div>{JSON.stringify(state)}</div>

}