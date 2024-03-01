import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: "side-bar",
    templateUrl: "./side-bar.component.html",
    styleUrls: ["side-bar.component.scss"],
})
export class SideBarComponent {
    constructor(private router : Router) { }

    ngOnInit() {
       
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
        }else if(master === 'vendor'){
            this.router.navigate(['/master/vendor'])
        }
    }
}
