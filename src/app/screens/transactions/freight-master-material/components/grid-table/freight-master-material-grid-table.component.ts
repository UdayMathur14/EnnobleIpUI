import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-freight-master-material-grid-table',
  templateUrl: './freight-master-material-grid-table.component.html',
  styleUrl: './freight-master-material-grid-table.component.scss'
})
export class FreightMasterMaterialGridTableComponent implements OnInit{
  constructor(private freightService: FreightService, private toastr: ToastrService,) {}

  freightList: any;
  loadSpinner : boolean = true;

  ngOnInit(): void {
    this.getAllFreightListInit();
  }

     //GETTINGS FREIGHTS LISTING ON PAGE LOAD
  getAllFreightListInit() {
    let data = {
      "freightCode": '',
      "sourceId": 0,
      "vehicleSizeId": 0
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.freightList = response.freights;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

}