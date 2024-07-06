import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { PartService } from '../../../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-part-filters',
  templateUrl: './part-filter.component.html',
  styleUrl: './part-filter.component.scss'
})
export class PartFiltersComponent implements OnInit {
  @Input() filters : any = [];
  @Output() getData: EventEmitter<object> = new EventEmitter();
  partNum: any = undefined;
  partName:any = undefined;
  status: any = undefined;

  constructor(
    private partService: PartService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {

  }

  // BINDING PART NUMBERS AND PART NAMES DROPDOWNS

  onPartSearch(){
    const obj = {
      "partName": this.partName,
      "partNumber": this.partNum,
      "status": this.status
    }
    this.getData.emit(obj)
  }

  onClearFilter() {
    this.partNum = undefined;
    this.partName = undefined;
    this.status = undefined
    let obj = {
      "partName": undefined,
      "partNumber": undefined,
      "status": undefined
    }
    this.getData.emit(obj)
  }

}