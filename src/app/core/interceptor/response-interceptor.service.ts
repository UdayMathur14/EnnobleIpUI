import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { APIConstant } from "../constants";

@Injectable({
    providedIn: "root"
})
export class ResponseInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError((err: any) => {
                if (err instanceof HttpErrorResponse) {console.log(err);
                    if (err.status === 401 || err.status === 0) {
                        //this.router.navigate(['/login']);
                        //window.location.href  = `${APIConstant.Ums}/auth/login?return_url=${window.location.href}`;
                    }
                }
                return throwError(err);
            })
        );
    }
}
