import {TasksStateType} from "../App";

import {
    removeTaskAC,
    tasksReducer,
    TaskPriorities,
    TaskStatuses,
    addTaskAC,
    changeTaskStatusAC, changeTaskTitleAC
} from "../state/tasks-reducer";
let startState : TasksStateType = {
    // 'arr1': [{
    //     id: 't1',
    //     title: 'string',
    //     todoListId: 'string',
    //     order: 7,
    //     status: TaskStatuses.New,
    //     priority: TaskPriorities.Hi,
    //     addedDate: 'string',
    //     startDate: 'any',
    //     deadline: 'any',
    //     description: 'any',
    // }]
}

beforeEach(() => {
    startState = {
        'arr1': [{
            id: 't1',
            title: 'string',
            todoListId: 'string',
            order: 7,
            status: TaskStatuses.New,
            priority: TaskPriorities.Hi,
            addedDate: 'string',
            startDate: 'any',
            deadline: 'any',
            description: 'any',
        },
            {
                id: 't2',
                title: 'some title',
                todoListId: 'string',
                order: 7,
                status: TaskStatuses.New,
                priority: TaskPriorities.Hi,
                addedDate: 'string',
            },
        ]
    }
})

test("correct task should be removed", () => {
    const endState = tasksReducer(startState, removeTaskAC('t1', 'arr1'));
    expect(endState['arr1'].length).toBe(1)
})

test("add task with correctly title to correctly todoList",()=>{
    const endState = tasksReducer(startState,addTaskAC('newTitle','arr1'))
    expect(endState['arr1'].length).toBe(3)
})

test('change task status',()=>{
    const endState = tasksReducer(startState,changeTaskStatusAC('t2',TaskStatuses.New,'arr1'))
    expect(endState['arr1'][1].status).toBe(TaskStatuses.New)
})

test('change task title',()=>{
    const endState = tasksReducer(startState,changeTaskTitleAC('t2','newTitle','arr1'))
    expect(endState['arr1'][1].title).toBe('newTitle')
})