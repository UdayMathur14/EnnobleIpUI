import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: "header-bar",
    templateUrl: "./header-bar.component.html",
    styleUrls: ["header-bar.component.scss"],
})
export class HeaderBarComponent {

    // userName = JSON.parse(localStorage.getItem('profile') || '')?.userName;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {

    }

    logout() {
        this.authService.logout();
        // this.router.navigate(['http://192.168.29.100:90/login']);
    }
}
