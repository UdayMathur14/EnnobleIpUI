import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-advice-filter',
  templateUrl: './advice-filter.component.html',
  styleUrl: './advice-filter.component.scss'
})
export class AdviceFilterComponent implements OnInit {
  @Input() locations : any[] = [];
  @Input() filters : any = [];
  @Output() getData : EventEmitter<object> = new EventEmitter();
  adviceType : any = undefined;
  batchName: any = undefined;
  locationIds : any[] = APIConstant.commonLocationsList.map((e: any) => (e.id));
  status: any = undefined;

  constructor(){}

  ngOnInit(): void {
  }

  onAdviceSearch(){
    let obj = {
      "locationIds": this.locationIds || [],
      "adviceType" : this.adviceType || "",
      "status": this.status || "",
      "batchName": this.batchName || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.adviceType = undefined;
    this.locationIds = this.locationIds;
    this.status = undefined;
    this.batchName = undefined;
    let obj = {
      "adviceType" : "",
      "locationIds": this.locationIds,
      "status": "",
      "batchName": ""
    }
    this.getData.emit(obj)
  }
  
}
