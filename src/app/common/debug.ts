import { Observable } from "rxjs"
import { tap } from "rxjs/operators"

export enum DebugLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

export const debug = (level: number, message: string) => {
  return (source: Observable<any>) => {
    return source.pipe(
      tap((value) => {
        console.log(`[DEBUG ${level}] ${message}: `, value);
      })
    )
  }
}