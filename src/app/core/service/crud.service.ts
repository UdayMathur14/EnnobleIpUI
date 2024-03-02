import { Optional } from "@angular/core";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
import { CommonUtility } from "../utilities/common";

export class CRUDService<T> {
    protected apiPath = "";
    constructor(protected baseService: BaseService, @Optional() name: string = "master") {
        this.apiPath = name;
    }

    get(params?: { [key: string]: any }): Observable<T[]> {
        let url: string = this.apiPath;
        const query = CommonUtility.convertObjectToParams(params);
        if (query) {
            url += `?${query}`;
        }
        return this.baseService.get<T[]>(url);
    }

    getById(id: number): Observable<T> {
        return this.baseService.get<T>(`${this.apiPath}${id}`);
    }

    add(data: T): Observable<T> {
        return this.baseService.post<T>(this.apiPath, data);
    }

    update(id: number, data: T): Observable<T> {
        let url: string = this.apiPath;
        if (id) {
            url += `${id}`;
        }
        return this.baseService.put<T>(url, data);
    }

    remove(id: number): Observable<any> {
        return this.baseService.delete<any>(`${this.apiPath}${id}`);
    }

    removeByParams(params?: { [key: string]: any }): Observable<T[]> {
        let url: string = this.apiPath;
        const query = CommonUtility.convertObjectToParams(params);
        if (query) {
            url += `?${query}`;
        }
        return this.baseService.delete<any>(url);
    }
}
