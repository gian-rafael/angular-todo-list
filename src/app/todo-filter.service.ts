import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { Priority } from "./models/todo";

export type FilterOptions = {
  [key in Priority]: boolean;
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
    });

  get filters() {
    return this.filters$;
  }

  constructor() {}

  setFilters(filters: FilterOptions) {
    this.filters$.next(filters);
  }
}
