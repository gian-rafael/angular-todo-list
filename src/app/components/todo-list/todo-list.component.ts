import { switchMap } from "rxjs/operators";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
} from "@angular/core";

import { Todo } from "../../models/todo";
import { TodoFilterService } from "../../todo-filter.service";
import { Subscription, BehaviorSubject, Subject } from "rxjs";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: [
    //"./todo-list.component.scss"
  ],
})
export class TodoListComponent implements OnChanges, OnInit, OnDestroy {
  @Input() todos: Todo[] = [];

  selectedTodos$: BehaviorSubject<Todo[]> = new BehaviorSubject(this.todos);
  private changeObserver$ = new Subject();

  @Output() edit = new EventEmitter<Todo>();
  @Output() toggle = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<Todo>();

  filterSubscription: Subscription;

  constructor(private filterService: TodoFilterService) {}

  ngOnChanges(changes) {
    if (changes.todos) {
      this.changeObserver$.next();
    }
  }

  ngOnInit() {
    this.filterSubscription = this.changeObserver$
      .pipe(switchMap(() => this.filterService.filters))
      .subscribe((filters) => {
        if (this.todos) {
          let filtered = this.todos.filter(
            (todo) => filters[todo.priority] === true
          );
          if (filters.completed && filters.pending) {
            return this.selectedTodos$.next(filtered);
          }
          if (filters.completed) {
            return this.selectedTodos$.next(
              filtered.filter((todo) => todo.status === "completed")
            );
          }
          if (filters.pending) {
            return this.selectedTodos$.next(
              filtered.filter((todo) => todo.status === "pending")
            );
          }
        }
      });
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
  }

  onEdit(todo: Todo) {
    this.edit.emit(todo);
  }

  onToggle(todo: Todo) {
    this.toggle.emit(todo);
  }

  onDelete(todo: Todo) {
    this.delete.emit(todo);
  }
}
