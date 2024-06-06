import { Optional } from "@angular/core";
import { BaseService } from "./base.service";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { CommonUtility } from "../utilities/common";

export class CRUDService<T> {
    
    protected baseUrl = "";
    locationIds = Number(localStorage.getItem('locationId'));
    plantSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    vendorSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    partSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    lookupSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    lookupData = new Subject;

    constructor(protected baseService: BaseService, @Optional() name: string = "master") {
        this.baseUrl = name;
    }

    get(path: string, params?: { [key: string]: any }): Observable<T[]> {
        let url: string = this.baseUrl + path;
        const query = CommonUtility.convertObjectToParams(params);
        if (query) {
            url += `?${query}`;
        }
        return this.baseService.get<T[]>(url);
    }

    getById(id: number): Observable<T> {
        return this.baseService.get<T>(`${this.baseUrl}${id}`);
    }

    post(path: string, data: any): Observable<T> {
        return this.add(path, data);
    }
    put(path: string, data: T) {
        return this.update(path, data);
    }

    add(path: string, data: any): Observable<T> {
        return this.baseService.post<T>(this.baseUrl + path, data);
    }

    update(path: string, data: T): Observable<T> {
        let url: string = this.baseUrl + path;
        return this.baseService.put<T>(url, data);
    }

    remove(id: number): Observable<any> {
        return this.baseService.delete<any>(`${this.baseUrl}${id}`);
    }

    removeByParams(params?: { [key: string]: any }): Observable<T[]> {
        let url: string = this.baseUrl;
        const query = CommonUtility.convertObjectToParams(params);
        if (query) {
            url += `?${query}`;
        }
        return this.baseService.delete<any>(url);
    }
}
