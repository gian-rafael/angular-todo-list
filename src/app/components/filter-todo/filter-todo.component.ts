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

  constructor(private filterService: TodoFilterService) {
    this.filters = filterService.filters.value;
  }

  setFilters() {
    console.log(this.filters);
    this.filterService.setFilters(this.filters);
  }
}
