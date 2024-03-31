import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PartService } from '../../../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-part-filters',
  templateUrl: './part-filter.component.html',
  styleUrl: './part-filter.component.scss'
})
export class PartFiltersComponent implements OnInit {
  constructor(private partService : PartService,
    private toastr : ToastrService){}
  @Output() partFilterObj : EventEmitter<object> = new EventEmitter();
  partNum: string | undefined;
  partName : string = '';
  partsList : any;

  ngOnInit(): void {
    this.getAllPartsListInit();
  }

  //BINDING PART NUMBERS DROPDOWN
  getAllPartsListInit() {
    let data = {
      "partNumber": ''
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    })
  }

  onPartSearch(){
    let obj = {
      partName : this.partName,
      partCode : this.partNum
    }
    this.partFilterObj.emit(obj)
  }
  onClearFilter(){
    this.partNum = undefined;
    this.partName = '';
    let obj = {
      partName : '',
      partCode : ''
    }
    this.partFilterObj.emit(obj)
  }

}
