import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PointChargeService } from '../../../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../../../../../core/service/base.service';

@Component({
  selector: 'app-point-charge-grid-table',
  templateUrl: './point-charge-grid-table.component.html',
  styleUrl: './point-charge-grid-table.component.scss'
})
export class PointChargeGridTableComponent implements OnInit, OnChanges {
  constructor(
    private router: Router,
    private pointChargeService: PointChargeService,
    private toastr: ToastrService,
    private baseService : BaseService,
  ) { }

  pointChargesList:any;
  pointChargeListOrg:any;
  @Input() filterKeyword!: string;

  ngOnInit() :void{
    this.getAllPointChargesList()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.pointChargeListOrg && this.pointChargeListOrg.length && changes['filterKeyword'].currentValue){
      this.pointChargesList = this.pointChargeListOrg.filter((e:any) =>e.pointName.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if(this.pointChargeListOrg && this.pointChargeListOrg.length && !changes['filterKeyword'].currentValue){
      this.pointChargesList = this.pointChargeListOrg;
    }
  }


  onEditPointCharge() {
    this.router.navigate(['master/addEditPointCharge']);
  }

  getAllPointChargesList(){
    let data = {
      "pointName" : ''
    }
    this.pointChargeService.getPointCharges(data).subscribe((response:any) => {
      this.pointChargesList = response.pointCharges;
      this.pointChargeListOrg = response.pointCharges;
      this.baseService.pointChargeSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.baseService.pointChargeSpinner.next(false);
    })
  }


}