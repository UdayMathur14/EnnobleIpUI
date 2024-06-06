import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PointChargeService } from '../../../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../../../../../core/service/base.service';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-point-charge-grid-table',
  templateUrl: './point-charge-grid-table.component.html',
  styleUrl: './point-charge-grid-table.component.scss'
})
export class PointChargeGridTableComponent implements OnInit, OnChanges {

  @Input() filterKeyword!: string;
  @Input() locationIds!: any[];

  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  pointChargesList: any;
  pointChargeListOrg: any;
  loadSpinner: boolean = true;

  constructor(
    private router: Router,
    private pointChargeService: PointChargeService,
    private toastr: ToastrService,
    private baseService: BaseService,
  ) { }

  ngOnInit(): void {
    this.getAllPointChargesList()
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (this.pointChargeListOrg && this.pointChargeListOrg.length && changes?.['filterKeyword'] && changes?.['filterKeyword'].currentValue) {
      this.pointChargesList = this.pointChargeListOrg.filter((e: any) => e.pointName.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if (this.pointChargeListOrg && this.pointChargeListOrg.length && !changes['filterKeyword']?.currentValue) {
      this.pointChargesList = this.pointChargeListOrg;
    }

    if (changes?.locationIds?.currentValue) {
      this.getAllPointChargesList();
    }
  }

  // NAVIGATING TO EDIT POINT MASTER PAGE
  onEditPointCharge(pointChargeData: any) {
    this.router.navigate(['master/editPointCharge', pointChargeData.id]);
  }

  // GET ALL POINT CHARGE
  getAllPointChargesList() {
    let data = {
      "screenCode": 101,
      "pointName": '',
      locationIds: this.locationIds
    }
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.pointChargesList = response.pointCharges;
      this.pointChargeListOrg = response.pointCharges;
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.pointChargesList);
  }
}

