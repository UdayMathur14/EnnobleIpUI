import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-point-filter',
  templateUrl: './point-filter.component.html',
  styleUrl: './point-filter.component.scss'
})
export class PointFilterComponent implements OnInit {
<<<<<<< HEAD
  @Input() locations : any[] = [];
  @Input() pointChargesList : any[] = [];
  @Output() getData : EventEmitter<object> = new EventEmitter();
  locationIds : any = [];
  pointName : any = undefined;
=======
  @Input() pointChargesList : any[] = [];
  pointName : any = undefined;
  @Output() getData : EventEmitter<object> = new EventEmitter();
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  
  constructor(){}

  ngOnInit(): void {
  }

  onFreightSearch(){
    let obj = {
<<<<<<< HEAD
      "pointName" : this.pointName || "",
      "locationIds" : this.locationIds || []
=======
      "pointName" : this.pointName || ""
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.pointName = undefined;
<<<<<<< HEAD
    this.locationIds = [];
    let obj = {
      "pointName" : undefined,
      "locationIds" : []
=======
    let obj = {
      pointName : undefined
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    }
    this.getData.emit(obj)
  }
  
}
