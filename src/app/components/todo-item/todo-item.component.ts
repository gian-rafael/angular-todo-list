import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";

import { PriorityOption, Todo } from "../../models/todo";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-todo-item",
  templateUrl: "./todo-item.component.html",
  styleUrls: ["./todo-item.component.scss"],
})
export class TodoItemComponent implements OnChanges {
  @Input() todo: Todo;

  @Output() edit = new EventEmitter<Todo>();
  @Output() toggle = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<Todo>();

  editting = false;

  priorityOptions: PriorityOption[] = [
    {
      name: "Low",
      value: "low",
    },
    {
      name: "Medium",
      value: "medium",
    },
    {
      name: "High",
      value: "high",
    },
  ];

  constructor() {}

  toggleTodo() {
    if (!this.editting) {
      this.todo.status =
        this.todo.status === "completed" ? "pending" : "completed";
      this.toggle.emit(this.todo);
    }
  }

  deleteTodo() {
    this.delete.emit(this.todo);
  }

  editTodo(form?: NgForm) {
    if (this.editting) {
      if (form && form.invalid || this.todo.task === "") {
        return;
      }
      this.edit.emit(this.todo);
    }
    this.editting = !this.editting;
  }

  ngOnChanges(changes) {
    if (changes.todo) {
      this.todo = Object.assign({}, this.todo);
    }
  }
}
