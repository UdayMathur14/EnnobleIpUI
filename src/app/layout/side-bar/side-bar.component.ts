import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

@Component({
    selector: "side-bar",
    templateUrl: "./side-bar.component.html",
    styleUrls: ["side-bar.component.scss"],
})
export class SideBarComponent {
    constructor(private router: Router, private authGuard: AuthGuard) { };
    isMasterModule: boolean = true;

    ngOnInit() {
        this.isMasterModule = window.location.pathname.includes('/master/');
    }

    securityGroups(permission: String) {
        return this.authGuard.securityGroups(permission);
    }

    onMasterChange(master: string) {
        if (master === 'plant') {
            this.router.navigate(['/master/plant'])
        } else if (master === 'part') {
            this.router.navigate(['/master/part'])
        } else if (master === 'vehicle') {
            this.router.navigate(['/master/vehicle'])
        } else if (master === 'freight') {
            this.router.navigate(['/master/freight'])
        } else if (master === 'advice') {
            this.router.navigate(['/master/advice'])
        } else if (master === 'vendor') {
            this.router.navigate(['/master/vendor'])
        } else if (master === 'transactionType') {
            this.router.navigate(['/master/transactionTypes'])
        } else if (master === 'transporter') {
            this.router.navigate(['/master/transporter'])
        } else if (master === "pointCharge") {
            this.router.navigate(['/master/pointCharge'])
        } else if (master === "lookup") {
            this.router.navigate(['/master/lookup'])
        } else if (master === "lookupType") {
            this.router.navigate(['/master/lookupType'])
        }
    }

    onTransactionChange(transaction: string) {
        if (transaction === 'dispatchNote') {
            this.router.navigate(['/transaction/dispatchNote'])
        } else if (transaction === 'bilti') {
            this.router.navigate(['/transaction/bilti'])
        } else if (transaction === 'biltiBillProcess') {
            this.router.navigate(['/transaction/biltiBillProcess'])
        } else if (transaction === 'biltiBillProcessView') {
            this.router.navigate(['/transaction/biltiBillProcessView'])
        } else if (transaction === 'pointMasterAccounts') {
            this.router.navigate(['/transaction/pointMasterAccounts'])
        } else if (transaction === 'pointMasterMaterial') {
            this.router.navigate(['/transaction/pointMasterMaterial'])
        } else if (transaction === 'freightMasterAccounts') {
            this.router.navigate(['/transaction/freightMasterAccounts'])
        } else if (transaction === 'freightMasterMaterial') {
            this.router.navigate(['/transaction/freightMasterMaterial'])
        } else if (transaction === 'freightMasterMaterial') {
            this.router.navigate(['/transaction/freightMasterMaterial'])
        } else if (transaction === 'checkedMaterialsTeam') {
            this.router.navigate(['/transaction/checkedMaterialsTeam'])
        } else if (transaction === 'approvalMaterialHead') {
            this.router.navigate(['/transaction/approvalMaterialHead'])
        } else if (transaction === 'approvalAccounts') {
            this.router.navigate(['/transaction/approvalAccounts'])
        } else if (transaction === 'changeBiltiStatus') {
            this.router.navigate(['/transaction/changeBiltiStatus'])
        }
    }
}
