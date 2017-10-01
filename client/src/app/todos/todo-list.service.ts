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
    getOwner(owner: string): Observable<Todo[]>{
        console.log("getting owner...")
        this.todoUrl= environment.API_URL + "todos?owner="+owner;
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
