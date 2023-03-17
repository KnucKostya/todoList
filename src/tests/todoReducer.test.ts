import {
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer,
    TodolistType
} from '../state/todolists-reducer'

let startState:Array<TodolistType> = []
beforeEach(()=>{
    startState = [{
        id: 'id',
        title: '',
        addedDate: '',
        order: 0,
        filter:'all'
    }]
})

test('current todo should be deleted',()=>{
    const endState = todolistsReducer(startState,removeTodolistAC('id'))
    expect(endState.length).toBe(0)
})

test('correctly title and todo should be added',()=>{
    const endState = todolistsReducer(startState,addTodolistAC('newTitle'))
    expect(endState[0].title).toBe('newTitle')
    expect(endState.length).toBe(2)
})

test("correct todo title should be changed",()=>{
    const endState = todolistsReducer(startState,changeTodolistTitleAC("id",'title'))
    expect(endState[0].title).toBe('title')
})

test("correct todo filter should be changed",()=>{
    const endState = todolistsReducer(startState,changeTodolistFilterAC('id','completed'))
    expect(endState[0].filter).toBe('completed')
})