import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LookupService } from '../../../../../core/service/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-lookup-grid-table',
  templateUrl: './lookup-grid-table.component.html',
  styleUrl: './lookup-grid-table.component.scss'
})
export class LookupGridTableComponent implements OnInit, OnChanges {

  @Input() filterKeyword!: string;
  lookupsListOrg: any;
  lookupsList: any;
  loadSpinner: boolean = true;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  constructor(
    private router: Router,
    private lookupService: LookupService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllLookupsList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.lookupsListOrg && this.lookupsListOrg.length && changes['filterKeyword'] && changes['filterKeyword'].currentValue) {
      this.lookupsList = this.lookupsListOrg.filter((e: any) =>
        e.code && e.code.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    } else if (this.lookupsListOrg && this.lookupsListOrg.length && (!changes['filterKeyword'] || !changes['filterKeyword'].currentValue)) {
      this.lookupsList = this.lookupsListOrg;
    }
  }

  onGoToEditLookup(lookupData: any) {
    this.router.navigate(['master/addEditLookup', lookupData.id]);
  }

  getAllLookupsList() {
    this.lookupService.getLookups({ data: '' }).subscribe((response: any) => {
      this.lookupsList = response.lookUps;
      this.lookupsListOrg = response.lookUps;
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.lookupsList);
  }

}
