import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import moment from 'moment';
import { fromEvent } from 'rxjs';
import { concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    standalone: false
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course: Course;

    @ViewChild('saveButton', { static: true, read: ElementRef }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription, Validators.required]
        });

    }

    ngOnInit() {
        this.form.valueChanges
            .pipe(
                filter(() => this.form.valid),
                mergeMap((values) => {
                    return this.saveChanges(values);
                })
            ).subscribe()
    }

    saveChanges(values: any) {
        return fromPromise(fetch('http://localhost:9000/api/courses/' + this.course.id, {
            method: 'PUT',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        }))
    }



    ngAfterViewInit() {
        fromEvent(this.saveButton.nativeElement, 'click')
            .pipe(
                tap(() => console.log('save button clicked')),
                exhaustMap(() => this.saveChanges(this.form.value)),
            ).subscribe()
    }



    close() {
        this.dialogRef.close();
    }

    save() {

    }
}
