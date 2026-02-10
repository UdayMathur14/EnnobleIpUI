import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
// import { AuthGuard } from '../../core/guards/auth.guard';

@Component({
    selector: "side-bar",
    templateUrl: "./side-bar.component.html",
    styleUrls: ["side-bar.component.scss"],
})
export class SideBarComponent {
    constructor(private router: Router , private authGuard: AuthGuard) { };
    selectedAccordion: string = 'master';

    ngOnInit() {
        this.selectedAccordion = window.location.pathname.includes('/master/') ? 'master' : window.location.pathname.includes('/transaction/') ? 'transactions' : 'report';
    }

    securityGroups(permission: any) {
        //return this.authGuard.securityGroups(permission);
        return true;
    }

    onMasterChange(master: string) {
        if (master === 'customer') {
            this.router.navigate(['/master/customer'])
        } else if (master === 'vehicle') {
            this.router.navigate(['/master/vehicle'])
        } else if (master === 'freight') {
            this.router.navigate(['/master/freight'])
        } else if (master === 'advice') {
            this.router.navigate(['/master/advice'])
        } else if (master === 'vendor') {
            this.router.navigate(['/master/vendor'])
        } else if (master === 'bank') {
            this.router.navigate(['/master/bank'])
        } else if (master === 'transporter') {
            this.router.navigate(['/master/transporter'])
        } else if (master === "pointCharge") {
            this.router.navigate(['/master/pointCharge'])
        } else if (master === "lookup") {
            this.router.navigate(['/master/lookup'])
        } else if (master === "recycleBin") {
            this.router.navigate(['/master/recycleBinPlantConfiguration'])
        }else if (master === "lookupType") {
            this.router.navigate(['/master/lookupType'])
        }
        
    }

    onTransactionChange(transaction: string) {
        if (transaction === 'dispatchNote') {
            this.router.navigate(['/transaction/VendorInvoiceTxn'])
        }
        else if (transaction === 'dispatchNote1') {
            this.router.navigate(['/transaction/SalesInvoiceTxn'])
        }
        else if (transaction === 'pointMasterAccounts') {
            this.router.navigate(['/transaction/paymentManagements'])
        } else if (transaction === 'bilti') {
            this.router.navigate(['/transaction/paymentManagement'])
        } else if (transaction === 'biltiBillProcessView') {
            this.router.navigate(['/transaction/biltiBillProcessView'])
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
        } else if (transaction === 'apOutbound') {
            this.router.navigate(['/transaction/apOutbound'])
        } else if (transaction === 'glAccrualPosting') {
            this.router.navigate(['/transaction/glAccrual-posting'])
        }
    }

    onreportChange(report: string){
        if (report === 'vendorpurchase') {
            this.router.navigate(['/report/vendorpurchase'])
        } else if (report === 'OutStandingvendorPayment') {
            this.router.navigate(['/report/OutStandingvendorPayment'])
        } else if (report === 'vendorsearch') {
            this.router.navigate(['/report/vendorsearch'])
        } else if (report === 'pendingSaleInvoices') {
            this.router.navigate(['/report/pendingSaleInvoices'])
        } else if (report === 'adhoc-report') {
            this.router.navigate(['/report/adhoc-report'])
        } else if (report === 'processing-report') {
            this.router.navigate(['/report/processed-report'])
        }
    }

    hasPermission(key: string): boolean {
        const profile: any = localStorage.getItem("profile");
        const userData = JSON.parse(profile);
        if (userData && userData.permissions) {
          return userData.permissions.some((permission: string) => permission.startsWith(key));
        }
      
        return false;
      }
}
