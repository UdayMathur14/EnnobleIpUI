import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-point-filter',
  templateUrl: './point-filter.component.html',
  styleUrl: './point-filter.component.scss'
})
export class PointFilterComponent implements OnInit {
  @Input() pointChargesList : any[] = [];
  pointName : any = undefined;
  @Output() getData : EventEmitter<object> = new EventEmitter();
  
  constructor(){}

  ngOnInit(): void {
  }

  onFreightSearch(){
    let obj = {
      "pointName" : this.pointName || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.pointName = undefined;
    let obj = {
      pointName : undefined
    }
    this.getData.emit(obj)
  }
  
}
