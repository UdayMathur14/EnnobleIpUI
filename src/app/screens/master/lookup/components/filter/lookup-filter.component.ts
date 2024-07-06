import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lookup-filter',
  templateUrl: './lookup-filter.component.html',
  styleUrl: './lookup-filter.component.scss'
})
export class LookupFilterComponent implements OnInit {
  @Input() filters : any = [];
  lookupCode : any = undefined;
  lookupType: any = undefined;
  lookupValue: any = undefined;
  status: any = undefined;
  @Output() getData : EventEmitter<object> = new EventEmitter();
  
  constructor(){}

  ngOnInit(): void {
  }

  onLookupSearch(){
    let obj = {
      "code" : this.lookupCode || "",
      "lookUpType":this.lookupType || "",
      "value": this.lookupValue || "",
      "status": this.status || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.lookupCode = undefined;
    this.lookupType = undefined;
    this.lookupValue = undefined;
    this.status = undefined
    let obj = {
      "code" : undefined,
      "lookupType": undefined,
      "lookupValue": undefined,
      "status": undefined
    }
    this.getData.emit(obj)
  }
  
}
