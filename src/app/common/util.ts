import { Observable } from "rxjs"

export const createHttpObserverable = <T>(path: string, data?: any) => {
    return new Observable<T>(observer => {
        fetch(`http://localhost:9000/api${path}`, data)
            .then(res => res.json())
            .then(json => {
                observer.next(json as T)
                observer.complete()
            })
            .catch(error => observer.error(error))
    })
}