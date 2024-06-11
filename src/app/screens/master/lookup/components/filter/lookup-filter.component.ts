import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lookup-filter',
  templateUrl: './lookup-filter.component.html',
  styleUrl: './lookup-filter.component.scss'
})
export class LookupFilterComponent implements OnInit {
  @Input() lookupsList : any[] = [];
  lookupCode : any = undefined;
  @Output() getData : EventEmitter<object> = new EventEmitter();
  
  constructor(){}

  ngOnInit(): void {
  }

  onLookupSearch(){
    let obj = {
      "code" : this.lookupCode || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.lookupCode = undefined;
    let obj = {
      "code" : undefined
    }
    this.getData.emit(obj)
  }
  
}
