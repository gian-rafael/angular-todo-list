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
    completed: true,
    pending: true,
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
          low: todos.some((todo) => this.isFilterEnabled(todo, "low")),
          medium: todos.some((todo) => this.isFilterEnabled(todo, "medium")),
          high: todos.some((todo) => this.isFilterEnabled(todo, "high")),
          completed: todos.some((todo) => todo.status === "completed"),
          pending: todos.some((todo) => todo.status === "pending"),
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
      if (this.filters[name] === true) {
        event.preventDefault();
      }
      switch (name) {
        case "low":
          this.filters = {
            low: true,
            medium: false,
            high: false,
            completed: this.filters.completed,
            pending: this.filters.pending,
          };
          break;
        case "medium":
          this.filters = {
            low: false,
            medium: true,
            high: false,
            completed: this.filters.completed,
            pending: this.filters.pending,
          };
          break;
        case "high":
          this.filters = {
            low: false,
            medium: false,
            high: true,
            completed: this.filters.completed,
            pending: this.filters.pending,
          };
          break;
      }
    } else {
      this.filters[name] = !this.filters[name];
    }
    this.filterService.setFilters(this.filters);
  }

  handleStatusChange(value: string) {
    switch (value) {
      case "all":
        this.filters = { ...this.filters, completed: true, pending: true };
        break;
      case "completed":
        this.filters = { ...this.filters, completed: true, pending: false };
        break;
      case "pending":
        this.filters = { ...this.filters, completed: false, pending: true };
        break;
    }
    this.filterService.setFilters(this.filters);
  }

  private isFilterEnabled(todo: Todo, value: string) {
    let isEnabled = todo.priority === value;
    if (this.filters.completed && this.filters.pending) {
      return isEnabled;
    }

    if (this.filters.completed) {
      return isEnabled && todo.status === "completed";
    }

    if (this.filters.pending) {
      return isEnabled && todo.status === "pending";
    }
  }
}
