import { Observable } from "rxjs"

export const createHttpObserverable = <T>(path: string, data?: any) => {
    const url = `http://localhost:9000/api${path}`;
    return new Observable<T>(observer => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetch(url, {
            ...data,
            signal,
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    observer.error("Request failed with status code: " + res.status);
                }
            })
            .then(json => {
                observer.next(json as T)
                observer.complete()
            })
            .catch(error => observer.error(error))
    })
}