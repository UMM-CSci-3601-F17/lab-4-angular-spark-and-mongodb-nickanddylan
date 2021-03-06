import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';

import {Observable} from "rxjs";
import "rxjs/add/operator/map";

import {Todo} from './todo';
import {environment} from "../../environments/environment";


@Injectable()
export class TodoListService {
    private todoUrl: string = environment.API_URL + "todos";

    constructor(private http: Http) {
    }

    getTodos(): Observable<Todo[]> {
        this.todoUrl= environment.API_URL + "todos";

        let observable: Observable<any> = this.http.request(this.todoUrl);
        return observable.map(res => res.json());
    }
    getQueries(owner: string, content: string): Observable<Todo[]>{
        this.todoUrl= environment.API_URL + "todos";
        console.log("getting stuff...");
        if(content !== "" && owner === ""){
            this.todoUrl= environment.API_URL + "todos?contains="+content;
        }
        if(owner !== "" && content === "") {
            this.todoUrl = environment.API_URL + "todos?owner=" + owner;
        }
        if(owner !== "" && content !== ""){
            this.todoUrl = environment.API_URL + "todos?owner=" + owner+"&contains="+content;
        }
        let observable: Observable<any> = this.http.request(this.todoUrl);
        return observable.map(res => res.json());
    }

    getTodoById(id: string): Observable<Todo> {
        return this.http.request(this.todoUrl + "/" + id).map(res => res.json());
    }

    addNewTodo(owner: string, status: boolean, todoBody: string, category: string): Observable<Boolean> {
        const body = {owner:owner, status:status, body:todoBody, category:category};
        console.log(body);

        //Send post request to add a new user with the user data as the body with specified headers.
        return this.http.post(this.todoUrl + "/new", body).map(res => res.json());
    }
}
