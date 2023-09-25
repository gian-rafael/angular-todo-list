import { Component, Input, OnInit } from "@angular/core";
import { Todo } from "src/app/models/todo";
import { FilterOptions, TodoFilterService } from "src/app/todo-filter.service";

import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-filter-todo",
  templateUrl: "./filter-todo.component.html",
  styleUrls: [
//"./filter-todo.component.scss"
],
})
export class FilterTodoComponent implements OnInit {
  filters: FilterOptions = {
    low: true,
    medium: true,
    high: true,
  };

  @Input() todos$: Observable<Todo[]> = new Observable();
  inputState$: Observable<FilterOptions> = new Observable();

  private controlPressed: boolean = false;

  constructor(private filterService: TodoFilterService) {}

  ngOnInit() {
    this.filters = this.filterService.filters.value;
    document.addEventListener("keydown", this.handleKey.bind(this));
    document.addEventListener("keyup", this.handleKey.bind(this));

    this.inputState$ = this.todos$.pipe(
      switchMap((todos: Todo[]) =>
        of({
          low: todos.some((todo) => todo.priority === "low"),
          medium: todos.some((todo) => todo.priority === "medium"),
          high: todos.some((todo) => todo.priority === "high"),
        })
      )
    );
  }

  handleKey(event: KeyboardEvent) {
    this.controlPressed = event.ctrlKey;
  }

  setFilters(event: Event) {
    const { name } = event.target as HTMLInputElement;
    if (this.controlPressed) {
      event.preventDefault();
      switch (name) {
        case "low":
          this.filters = { low: true, medium: false, high: false };
          break;
        case "medium":
          this.filters = { low: false, medium: true, high: false };
          break;
        case "high":
          this.filters = { low: false, medium: false, high: true };
          break;
      }
    } else {
      this.filters[name] = !this.filters[name];
    }
    this.filterService.setFilters(this.filters);
  }
}
