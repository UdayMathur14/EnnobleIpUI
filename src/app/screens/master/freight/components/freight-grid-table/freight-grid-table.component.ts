import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FreightService } from '../../../../../core/service/freight.service';

@Component({
  selector: 'app-freight-grid-table',
  templateUrl: './freight-grid-table.component.html',
  styleUrl: './freight-grid-table.component.scss'
})

export class FreightGridTableComponent implements OnInit, OnChanges {
  constructor(private router: Router,
    private toastr: ToastrService,
    private freightService: FreightService) { }
    
  @Input()
  searchedFreight!: any;  
  freightList: any;
  loadSpinner : boolean = true;

  ngOnInit(): void {
    this.getAllFreightListInit();
  }

  //SORTING DATA FROM FILTER CHANGES
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['searchedFreight'].currentValue){
      this.getFilteredFreightsList();
    } else if(changes['searchedFreight'].firstChange === false && changes['searchedFreight'].currentValue === undefined){
      this.getAllFreightListInit();
    }
  }

  onGoToEditFreight(freightData : any) {
    this.router.navigate(['master/addEditFreight',  freightData.id]);
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

  //THIS IS EVENT EMITTED FN. WHICH CALLS WHEN WE SEARCH FREIGHT FROM FILTERS 
  getFilteredFreightsList() {
    let data = {
      "freightCode": this.searchedFreight.freightCode || "",
      "sourceId": this.searchedFreight.source || 0,
      "vehicleSizeId": this.searchedFreight.vehicleSize || 0,
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