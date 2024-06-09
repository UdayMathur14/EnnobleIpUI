import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { PartService } from '../../../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-part-filters',
  templateUrl: './part-filter.component.html',
  styleUrl: './part-filter.component.scss'
})
export class PartFiltersComponent implements OnInit {
  @Input() partsList : any[] = [];
  @Output() getData: EventEmitter<object> = new EventEmitter();
  partNum: any = undefined;
  partName:any = undefined;

  constructor(
    private partService: PartService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.getAllPartsListInit();
  }

  // BINDING PART NUMBERS AND PART NAMES DROPDOWNS
  getAllPartsListInit() {
    let data = {
      "partNumber": '',
      "partName": ''
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    })
  }

  onPartSearch(){
    const obj = {
      "partName": this.partName,
      "partNumber": this.partNum
    }
    this.getData.emit(obj)
  }

  onClearFilter() {
    this.partNum = undefined;
    this.partName = undefined;
    let obj = {
      "partName": undefined,
      "partNumber": undefined
    }
    this.getData.emit(obj)
  }

}