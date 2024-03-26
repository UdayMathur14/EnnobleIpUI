import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PartService } from '../../../../../core/service/part.service';
import { BaseService } from '../../../../../core/service/base.service';

@Component({
  selector: 'app-part-grid-table',
  templateUrl: './part-grid-table.component.html',
  styleUrl: './part-grid-table.component.scss'
})
export class PartGridTableComponent implements OnInit, OnChanges {
  constructor(private router: Router,
    private toastr: ToastrService,
    private baseService : BaseService,
    private partService: PartService) { }
    
  @Input()
  searchedPart!: string;  
  partsList: any;
  partsListOrg : any;
  loadSpinner : boolean = true;

  ngOnInit(): void {
    this.getAllPartsListInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['searchedPart'].currentValue){
      this.getFilteredPartsList();
    } else if(changes['searchedPart'].firstChange === false && changes['searchedPart'].currentValue === ''){
      this.getAllPartsListInit();
    }

  }

  onGoToEditPart(partData : any) {
    this.router.navigate(['master/addEditPart',  partData.id]);
  }

  //GETTINGS PARTS LISTING ON PAGE LOAD
  getAllPartsListInit() {
    let data = {
      "partNumber": this.searchedPart
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
      this.partsListOrg = response.parts;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  //THIS IS EVENT EMITTED FN. WHICH CALLS WHEN WE SEARCH PART FROM FILTERS 
  getFilteredPartsList() {
    let data = {
      "partNumber": this.searchedPart
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

}