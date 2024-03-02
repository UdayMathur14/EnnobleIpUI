import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: "side-bar",
    templateUrl: "./side-bar.component.html",
    styleUrls: ["side-bar.component.scss"],
})
export class SideBarComponent {
    constructor(private router : Router) { };
    isMasterModule : boolean = true;

    ngOnInit() {
        this.isMasterModule = window.location.pathname.includes('/master/');
    }

    onMasterChange(master : string){
        if(master === 'plant'){
            this.router.navigate(['/master/plant'])
        }else if(master === 'part'){
            this.router.navigate(['/master/part'])
        }else if(master === 'vehicle'){
            this.router.navigate(['/master/vehicle'])
        }else if(master === 'freight'){
            this.router.navigate(['/master/freight'])
        }else if(master === 'advice'){
            this.router.navigate(['/master/advice'])
        }else if(master === 'vendor'){
            this.router.navigate(['/master/vendor'])
        }else if(master === 'transactionType'){
            this.router.navigate(['/master/transactionTypes'])
        }else if(master === 'transporter'){
            this.router.navigate(['/master/transporter'])
        }else if(master === "pointCharge"){
            this.router.navigate(['/master/pointCharge'])
        }
    }

    onTransactionChange(transaction : string) {
        if(transaction === 'dispatchNote'){
            this.router.navigate(['/transaction/dispatchNote'])
        }
    }
}
