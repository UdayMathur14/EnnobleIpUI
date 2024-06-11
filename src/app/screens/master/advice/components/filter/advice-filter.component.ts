import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-advice-filter',
  templateUrl: './advice-filter.component.html',
  styleUrl: './advice-filter.component.scss'
})
export class AdviceFilterComponent implements OnInit {
  @Input() locations : any[] = [];
  @Input() advicesList : any[] = [];
  @Output() getData : EventEmitter<object> = new EventEmitter();
  adviceType : any = undefined;
  locationIds : any = [];

  constructor(){}

  ngOnInit(): void {
  }

  onAdviceSearch(){
    let obj = {
      "locationIds": this.locationIds || [],
      "adviceType" : this.adviceType || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.adviceType = undefined;
    this.locationIds = [];
    let obj = {
      "adviceType" : "",
      "locationIds": [],
    }
    this.getData.emit(obj)
  }
  
}
