// import { Injectable } from "@angular/core";
// import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from "@angular/common/http";
// import { Observable } from "rxjs";
// import { CommonConstant } from "../constants";

// @Injectable({
//     providedIn: "root",
// })
// export class AuthInterceptor implements HttpInterceptor {
//     constructor() { }

//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const tokenData = window.localStorage.getItem('profile');
//         if(tokenData){
//             req = req.clone({ headers: req.headers.set("Authorization", `Bearer ${JSON.parse(tokenData).accessToken}`) });
//         }
        
//         return next.handle(req);
//     }
// }



import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
  constructor() { }

  /**
   * Intercept HTTP requests and set the authorization header.
   * Also clears cache and cookies before proceeding.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clear cookies and cache to ensure clean token usage.
    this.clearCacheAndCookies();

    // const tokenData = window.localStorage.getItem('profile');
    // if (tokenData) {
    //   const accessToken = JSON.parse(tokenData).accessToken;
    //   req = req.clone({
    //     headers: req.headers.set("Authorization", `Bearer ${accessToken}`)
    //   });
    // }

    const tokenData = window.localStorage.getItem('profile');
    if (tokenData) {
      const accessToken = JSON.parse(tokenData).accessToken;
      req = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${accessToken}`)
      });
    }

        // Prevent caching of outgoing requests
        req = req.clone({
            headers: req.headers.set('Cache-Control', 'no-cache').set('Pragma', 'no-cache')
          });

    return next.handle(req);
  }

  /**
   * Clears cache, cookies, localStorage, and sessionStorage.
   */
//   private clearCacheAndCookies(): void {
//     console.log('Clearing cookies and cache...');

//     // // Remove specific tokens from localStorage and sessionStorage
//     // localStorage.removeItem('profile');  // Example: Clearing 'profile'
//     // localStorage.removeItem('accessToken');
//     // sessionStorage.removeItem('accessToken');

//     // // Optional: Clear all storage if needed
//     // localStorage.clear();
//     // sessionStorage.clear();

//     // // Clear all non-HttpOnly cookies
//     // document.cookie.split(";").forEach(cookie => {
//     //   const [key] = cookie.split("=");
//     //   document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//     // });

//     console.log('Cache and cookies cleared.');
//   }
private clearCacheAndCookies() {
    // Clear all cookies set via JavaScript (non-HttpOnly)
    document.cookie.split(";").forEach((cookie) => {
      const [key] = cookie.split("=");
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // Optionally clear localStorage/sessionStorage
    // localStorage.clear();
    // sessionStorage.clear();
  }
}
