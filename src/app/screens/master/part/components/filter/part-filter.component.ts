import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { PartService } from '../../../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

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
  locationIds : any[] = APIConstant.commonLocationsList.map((e:any)=>(e.id))
  locations : any[] = APIConstant.commonLocationsList;

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
      "status": this.status,
      "locationIds" : this.locationIds || [],
    }
    this.getData.emit(obj)
  }

  onClearFilter() {
    this.partNum = undefined;
    this.partName = undefined;
    this.status = undefined;
    this.locationIds = this.locationIds;
    let obj = {
      "partName": undefined,
      "partNumber": undefined,
      "status": undefined,
      "locationIds" : this.locationIds
    }
    this.getData.emit(obj)
  }

}