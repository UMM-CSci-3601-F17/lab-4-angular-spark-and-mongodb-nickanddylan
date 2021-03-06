import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";
import {Observable} from "rxjs";

@Component({
    selector: 'todo-list-component',
    templateUrl: 'todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
    providers: []
})

@Component({
    selector: 'dynamic-dropdown',
    template: `
        
    
    `
})

export class TodoListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public todos: Todo[];
    public filteredTodos: Todo[] = null;
    private todoAddSuccess : Boolean = false;

    public todoOwner : string = "";
    public todoStatus : string;
    public todoCategory: string = "";
    public todoContent: string = "";
    public categories: string[] = [];
    public newTodoOwner:string = "";
    public newTodoStatus: boolean = false;
    public newTodoBody: string = "";
    public newTodoCategory: string = "";



    //Inject the UserListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(public todoListService: TodoListService) {

    }

    addNewTodo(owner: string, status: boolean, body : string, category : string): void{
        if (this.newTodoOwner === "" || this.newTodoBody === "" || this.newTodoCategory === ""){
            alert("Please complete all fields.");
        }
        else {
        //Here we clear all the fields, there's probably a better way
        //of doing this could be with forms or something else
        this.newTodoOwner = null;
        this.newTodoStatus = null;
        this.newTodoBody = null;
        this.newTodoCategory = null;
        //this.categories.push(category);

            this.todoListService.addNewTodo(owner, status, body, category).subscribe(
                succeeded => {
                    this.todoAddSuccess = succeeded;
                    // Once we added a new User, refresh our user list.
                    // There is a more efficient method where we request for
                    // this new user from the server and add it to users, but
                    // for this lab it's not necessary
                    this.refreshTodos();
                });
        }
    }



    public filterTodos(searchCategory: string, searchStatus: string): Todo[] {

        this.filteredTodos = this.todos;

        //Filter by name
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }


        //Filter by status
        if (searchStatus != null) {
            searchStatus = searchStatus.toLocaleLowerCase();
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchStatus || todo.status.toString().toLowerCase() == searchStatus;
            });
        }

        return this.filteredTodos;
    }

    /**
     * Starts an asynchronous operation to update the users list
     *
     */

    categoryDropdown(): string[]{
        if (this.filteredTodos !== null){
            var i:number;
            for(i=0;i<this.filteredTodos.length;i++){
                if(this.categories.indexOf(this.filteredTodos[i].category)==-1){
                    console.log("adding category");
                    this.categories.push(this.todos[i].category);
                }
            }
        }
        return this.categories;
    }

    todoCount(): number {
        if (this.filteredTodos !== null) {
            return this.filteredTodos.length;
        }
        else{
            return 0;
        }
    }

    searchTodos(): Observable<Todo[]> {
        let todos : Observable<Todo[]>;

        if (this.todoOwner !== "" || this.todoContent !== ""){
            console.log("query specified");
            let todos : Observable<Todo[]> = this.todoListService.getQueries(this.todoOwner, this.todoContent);
            todos.subscribe(
                todos => {
                    this.todos = todos;
                    this.filterTodos(this.todoCategory,  this.todoStatus);
                },
                err => {
                    console.log(err);
                });
        }
        else{
            this.refreshTodos();
        }
        return todos;
    }

    refreshTodos(): Observable<Todo[]> {
        //Get Users returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)

        let todos : Observable<Todo[]> = this.todoListService.getTodos();
        todos.subscribe(
            todos => {
                this.todos = todos;
                this.filterTodos(this.todoCategory,  this.todoStatus);

            },
            err => {
                console.log(err);
            });
        return todos;
    }

    ngOnInit(): void {
        this.refreshTodos();
        this.categoryDropdown()
    }
}
