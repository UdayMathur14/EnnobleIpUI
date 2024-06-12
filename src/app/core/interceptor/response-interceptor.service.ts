import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { APIConstant } from "../constants";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root"
})
export class ResponseInterceptor implements HttpInterceptor {

    constructor(private toastr: ToastrService) { }

    
    handleError(error:any){
        if(error?.error?.details){
            return error?.error?.details?.map((detail: any) => detail.description).join('<br>')
        }else{
            return "Something went wrong";
        }
    }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError((err: any) => {
                if (err instanceof HttpErrorResponse) {console.log(err);
                    if (err.status === 401) {
                        //this.router.navigate(['/login']);
                        //window.location.href  = `${APIConstant.Ums}/auth/login?return_url=${window.location.href}`;
                    }else{
                        this.toastr.error(this.handleError(err));
                    }
                }

                
                return throwError(err);
            })
        );
    }
}
