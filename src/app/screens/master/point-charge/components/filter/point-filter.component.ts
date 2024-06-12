import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-point-filter',
  templateUrl: './point-filter.component.html',
  styleUrl: './point-filter.component.scss'
})
export class PointFilterComponent implements OnInit {
  @Input() locations : any[] = [];
  @Input() pointChargesList : any[] = [];
  @Output() getData : EventEmitter<object> = new EventEmitter();
  locationIds : any = [];
  pointName : any = undefined;
  
  constructor(){}

  ngOnInit(): void {
  }

  onFreightSearch(){
    let obj = {
      "pointName" : this.pointName || "",
      "locationIds" : this.locationIds || []
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.pointName = undefined;
    this.locationIds = [];
    let obj = {
      "pointName" : undefined,
      "locationIds" : []
    }
    this.getData.emit(obj)
  }
  
}
