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
  status: any = undefined;
  value: any = undefined;
  @Output() getData : EventEmitter<object> = new EventEmitter();
  
  constructor(){}

  ngOnInit(): void {
  }

  onLookupSearch(){
    let obj = {
      "code" : this.lookupCode || "",
      "lookUpType":this.lookupType || "",
      "status": this.status || "",
      "value": this.value || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.lookupCode = undefined;
    this.lookupType = undefined;
    this.status = undefined;
    this.value = undefined
    let obj = {
      "code" : undefined,
      "lookupType": undefined,
      "status": undefined,
      "value": undefined
    }
    this.getData.emit(obj)
  }
  
}
