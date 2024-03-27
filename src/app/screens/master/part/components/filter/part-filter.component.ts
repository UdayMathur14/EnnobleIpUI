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
  @Output() partNumber : EventEmitter<string> = new EventEmitter();
  partNum!: string;
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

  onPartSearch(partNum:string){
    this.partNumber.emit(partNum)
  }

}
