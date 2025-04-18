import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lookupType-filter',
  templateUrl: './lookupType-filter.component.html',
  styleUrl: './lookupType-filter.component.scss'
})
export class LookupTypeFilterComponent implements OnInit {
  @Input() filters : any = [];
  LookupTypeCode : any = undefined;
  LookupType: any = undefined;
  status: any = undefined;
  value: any = undefined;
  @Output() getData : EventEmitter<object> = new EventEmitter();
  
  constructor(){}

  ngOnInit(): void {
  }

  onLookupTypeSearch(){
    let obj = {
      "type" : this.LookupType || "",
      "status": this.status || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.LookupType = undefined;
    this.status = undefined;
    let obj = {
      "type" : this.LookupType || "",
      "status": this.status || ""
    }
    this.getData.emit(obj)
  }
  
}
