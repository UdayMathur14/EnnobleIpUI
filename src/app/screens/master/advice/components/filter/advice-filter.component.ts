import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-advice-filter',
  templateUrl: './advice-filter.component.html',
  styleUrl: './advice-filter.component.scss'
})
export class AdviceFilterComponent implements OnInit {
  @Input() advicesList : any[] = [];
  adviceType : any = undefined;
  @Output() getData : EventEmitter<object> = new EventEmitter();
  
  constructor(){}

  ngOnInit(): void {
  }

  onAdviceSearch(){
    let obj = {
      "adviceType" : this.adviceType || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.adviceType = undefined;
    let obj = {
      adviceType : undefined
    }
    this.getData.emit(obj)
  }
  
}
