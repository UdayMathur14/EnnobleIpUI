import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LookupTypeService } from '../../../../../core/service/lookup-type.service';

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

  constructor(
    private router: Router,
    private lookupTypeService: LookupTypeService,
    private toastr: ToastrService){}

  ngOnInit() :void{
    this.getAllLookupsTypeList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.lookupsTypeListOrg && this.lookupsTypeListOrg.length && changes['filterKeyword'].currentValue){
      this.lookupsTypeList = this.lookupsTypeListOrg.filter((e:any) =>e.code.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if(this.lookupsTypeListOrg && this.lookupsTypeListOrg.length && !changes['filterKeyword'].currentValue){
      this.lookupsTypeList = this.lookupsTypeListOrg;
    }
  }

  onGoToEditLookupType(lookupTypeData:any) {
    this.router.navigate(['master/addEditLookupType', lookupTypeData.id]);
  }

  getAllLookupsTypeList(){
    let data = {
      "type" : ''
    }
    this.lookupTypeService.getLookupsTypes(data).subscribe((response:any) => {
      console.log(response)
      this.lookupsTypeList = response.lookUpTypes;
      this.lookupsTypeListOrg = response.lookUpTypes;
      // this.baseService.lookupSpinner.next(false);
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }
}