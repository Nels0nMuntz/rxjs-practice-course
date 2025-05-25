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

  beginnerCourses$: Observable<Course[]>

  advancedCourses$: Observable<Course[]>

  constructor() {}

  ngOnInit() {
    const courses$ = this.http$.pipe(
      // Error handling strategy 1: catchError and return an empty array
      // catchError((error) => {
      //   console.log("Error loading courses", error);
      //   return of({ payload: []});
      // }),
      map((response) => Object.values(response["payload"]) as Course[]),
      shareReplay(),

      // Error handling strategy 2: retry the request after a delay
      retryWhen((errors) => errors.pipe(
        delayWhen(() => timer(1000)),
      ))
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses) => courses.filter((course) => course.category == "BEGINNER")),
    )

    this.advancedCourses$ = courses$.pipe(
      map((courses) => courses.filter((course) => course.category == "ADVANCED")),
    )
  }
}
