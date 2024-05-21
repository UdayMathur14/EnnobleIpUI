import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LookupTypeService } from '../../../../../core/service/lookup-type.service';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-lookup-type-grid-table',
  templateUrl: './lookup-type-grid-table.component.html',
  styleUrl: './lookup-type-grid-table.component.scss'
})
export class LookupTypeGridTableComponent {
  @Input() filterKeyword!: string;
  lookupsTypeListOrg : any;
  lookupsTypeList : any;
  loadSpinner : boolean = true;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(
    private router: Router,
    private lookupTypeService: LookupTypeService,
    private toastr: ToastrService){}

  ngOnInit() :void{
    this.getAllLookupsTypeList();
  }

  //SORTING DATA FROM FILTER CHANGES
  ngOnChanges(changes: SimpleChanges): void {
    if(this.lookupsTypeListOrg && this.lookupsTypeListOrg.length && changes['filterKeyword'].currentValue){
      this.lookupsTypeList = this.lookupsTypeListOrg.filter((e:any) =>e.type.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if(this.lookupsTypeListOrg && this.lookupsTypeListOrg.length && !changes['filterKeyword'].currentValue){
      this.lookupsTypeList = this.lookupsTypeListOrg;
    }
  }

  //NAVIGATE TO UPDATE OR CREATE LOOKUP-TYPE SCREEN
  onGoToEditLookupType(lookupTypeData:any) {
    this.router.navigate(['master/addEditLookupType', lookupTypeData.id]);
  }

  //THIS IS EVENT EMITTED FN. WHICH CALLS WHEN WE SEARCH LOOKUP-TYPE FROM FILTERS 
  getAllLookupsTypeList(){
    let data = {
      "type" : ''
    }
    this.lookupTypeService.getLookupsTypes(data).subscribe((response:any) => {
      this.lookupsTypeList = response.lookUpTypes;
      this.lookupsTypeListOrg = response.lookUpTypes;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('\n'));
      this.loadSpinner = false;
    })
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.lookupsTypeList);
  }
}