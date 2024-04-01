import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LookupService } from '../../../../../core/service/lookup.service';
import { BaseService } from '../../../../../core/service/base.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lookup-grid-table',
  templateUrl: './lookup-grid-table.component.html',
  styleUrl: './lookup-grid-table.component.scss'
})
export class LookupGridTableComponent implements OnInit, OnChanges {
  
  @Input() filterKeyword!: string;
  lookupsListOrg : any;
  lookupsList : any;

  constructor(
    private router: Router,
    private lookupService : LookupService,
    private baseService : BaseService,
    private toastr: ToastrService){}

  ngOnInit() :void{
    this.getAllLookupsList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.lookupsListOrg && this.lookupsListOrg.length && changes['filterKeyword'].currentValue){
      this.lookupsList = this.lookupsListOrg.filter((e:any) =>e.code.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if(this.lookupsListOrg && this.lookupsListOrg.length && !changes['filterKeyword'].currentValue){
      this.lookupsList = this.lookupsListOrg;
    }
  }

  onGoToEditLookup(lookupData:any) {
    this.router.navigate(['master/addEditLookup', lookupData.id]);
  }

  getAllLookupsList(){
    let data = {
      "code" : ''
    }
    this.lookupService.getLookups(data).subscribe((response:any) => {
      console.log(response)
      this.lookupsList = response.lookUps;
      this.lookupsListOrg = response.lookUps;
      this.baseService.lookupSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.baseService.lookupSpinner.next(false);
    })
  }

}
