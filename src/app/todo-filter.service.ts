import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { Priority, Status } from "./models/todo";

export type FilterOptions = {
  [key in Priority | Status]: boolean;
};

@Injectable({
  providedIn: "root",
})
export class TodoFilterService {
  private filters$: BehaviorSubject<FilterOptions> =
    new BehaviorSubject<FilterOptions>({
      low: true,
      medium: true,
      high: true,
      completed: true,
      pending: true,
    });

  get filters() {
    return this.filters$;
  }

  constructor() {}

  setFilters(filters: FilterOptions) {
    this.filters$.next(filters);
  }
}
