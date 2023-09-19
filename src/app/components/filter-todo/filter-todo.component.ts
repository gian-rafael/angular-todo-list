import { Component } from "@angular/core";
import { FilterOptions, TodoFilterService } from "src/app/todo-filter.service";

@Component({
  selector: "app-filter-todo",
  templateUrl: "./filter-todo.component.html",
  styleUrls: ["./filter-todo.component.scss"],
})
export class FilterTodoComponent {
  filters: FilterOptions = {
    low: true,
    medium: true,
    high: true,
  };

  private controlPressed: boolean = false;

  constructor(private filterService: TodoFilterService) {
    this.filters = filterService.filters.value;
    document.addEventListener("keydown", this.handleKey.bind(this));
    document.addEventListener("keyup", this.handleKey.bind(this));
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
