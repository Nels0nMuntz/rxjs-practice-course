import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObserverable } from '../common/util';
import { debug, DebugLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
    standalone: false
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true, read: ElementRef }) input: ElementRef;

    constructor(private route: ActivatedRoute) {

    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObserverable(`/courses/${this.courseId}`).pipe(
            debug(DebugLevel.DEBUG, "Course details"),
        )
    }


    ngAfterViewInit() {
        this.lessons$ = fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                map((event: any) => event.target.value),
                startWith(""),
                debug(DebugLevel.DEBUG, "Search input"),
                debounceTime(500),
                distinctUntilChanged(),
                switchMap(this.loadLessons)
            )
    }

    loadLessons = (search: string = "") => {

        const params = new URLSearchParams({
            courseId: this.courseId,
            filter: search,
            pageSize: '100'
        }).toString();

        return createHttpObserverable(`/lessons?${params}`)
            .pipe(
                map((response) => response['payload'] as Lesson[]),
            );
    }
}
