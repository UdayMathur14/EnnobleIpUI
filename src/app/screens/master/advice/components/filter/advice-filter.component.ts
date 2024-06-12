import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-advice-filter',
  templateUrl: './advice-filter.component.html',
  styleUrl: './advice-filter.component.scss'
})
export class AdviceFilterComponent implements OnInit {
<<<<<<< HEAD
  @Input() locations : any[] = [];
  @Input() advicesList : any[] = [];
  @Output() getData : EventEmitter<object> = new EventEmitter();
  adviceType : any = undefined;
  locationIds : any = [];

  constructor(){}

=======
  @Input() advicesList : any[] = [];
  adviceType : any = undefined;
  @Output() getData : EventEmitter<object> = new EventEmitter();
  
  constructor(){}

>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  ngOnInit(): void {
  }

  onAdviceSearch(){
    let obj = {
<<<<<<< HEAD
      "locationIds": this.locationIds || [],
=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
      "adviceType" : this.adviceType || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.adviceType = undefined;
<<<<<<< HEAD
    this.locationIds = [];
    let obj = {
      "adviceType" : "",
      "locationIds": [],
=======
    let obj = {
      adviceType : undefined
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    }
    this.getData.emit(obj)
  }
  
}
