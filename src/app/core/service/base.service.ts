import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class BaseService {
    
    constructor(private http: HttpClient) {
    }

    plantSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    partSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    get<T>(url: string): Observable<T> {
        return this.http.get<T>(url);
    }

    getWithHeader<T>(url: string, headers: any): Observable<T> {
        return this.http.get<T>(url, { headers: headers });
    }

    getWithResponse<T>(url: string): Observable<any> {
        return this.http.get<T>(url, { observe: 'response' });
    }

    getWithResponseType<T>(url: string, type: string = 'blob'): Observable<any> {
        return this.http.get<T>(url, { responseType: type as 'json' });
    }

    post<T>(url: string, data: any): Observable<T> {
        return this.http.post<T>(url, data);
    }

    postWithResponseType<T>(url: string, data: any, type: string = 'blob'): Observable<any> {
        return this.http.post<T>(url, data, { responseType: type as 'json' });
    }

    put<T>(url: string, data: any): Observable<T> {
        return this.http.put<T>(url, data);
    }

    delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(url);
    }

}

