import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AddTodoService {
  private isOpen$ = new BehaviorSubject(false);
  get isOpen() {
    return this.isOpen$.asObservable();
  }

  constructor() {}

  toggleTodo() {
    this.isOpen$.next(!this.isOpen$.value);
  }
}
