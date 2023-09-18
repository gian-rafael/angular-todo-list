import {
  Component,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { AddTodoService } from "../../add-todo.service";

import { Todo, PriorityOption } from "../../models/todo";

@Component({
  selector: "app-add-todo",
  templateUrl: "./add-todo.component.html",
  styleUrls: ["./add-todo.component.scss"],
})
export class AddTodoComponent implements OnInit, OnDestroy {
  @Output() add = new EventEmitter<
    Pick<Todo, "task" | "status" | "priority">
  >();

  userInput = "";
  priority = "";

  isOpen$: Observable<boolean> = new Observable();
  private inputClearSubscription: Subscription;

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

  constructor(private addTodoService: AddTodoService) {}

  ngOnInit() {
    this.isOpen$ = this.addTodoService.isOpen;
    this.inputClearSubscription = this.isOpen$.subscribe((isOpen) => {
      if (!isOpen) {
        this.userInput = "";
        this.priority = "";
      }
    });
  }

  ngOnDestroy() {
    this.inputClearSubscription.unsubscribe();
  }

  addTodo(todo: Pick<Todo, "task" | "status" | "priority">, form: NgForm) {
    this.add.emit({
      task: todo.task,
      status: "pending",
      priority: todo.priority,
    });
    form.resetForm();
    form.setValue({ priority: "", task: "" });
  }
}
