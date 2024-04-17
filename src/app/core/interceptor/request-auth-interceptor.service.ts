import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { CommonConstant } from "../constants";

@Injectable({
    providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const tokenData = window.localStorage.getItem('data');
        if(tokenData){
            req = req.clone({ headers: req.headers.set("Authorization", `${JSON.parse(tokenData).accessToken}`) });
        }
        
        return next.handle(req);
    }
}
