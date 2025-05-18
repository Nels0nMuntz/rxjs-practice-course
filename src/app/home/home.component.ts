import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { createHttpObserverable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: false,
})
export class HomeComponent implements OnInit {
  private http$ = createHttpObserverable("/courses");

  beginnerCourses: Course[] = [];

  advancedCourses: Course[] = [];

  constructor() {}

  ngOnInit() {
    const courses$ = this.http$.pipe(
      map((response) => Object.values(response["payload"]) as Course[])
    );

    courses$.subscribe(
      (courses) => {
        this.beginnerCourses = courses.filter(
          (course) => course.category == "BEGINNER"
        );
        this.advancedCourses = courses.filter(
          (course) => course.category == "ADVANCED"
        );
      },
      (error) => console.error("Error loading courses", error)
    );
  }
}
