import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { BiltiService } from '../../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-bilti-filter',
  templateUrl: './bilti-filter.component.html',
  styleUrl: './bilti-filter.component.scss'
})
export class BiltiFilterComponent implements OnInit {

  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Input() filters : any = [];
  biltiNum!: any | null;
  biltisList: any = [];
  loadSpinner: boolean = true;
  commonLocations: any = [];
  locationIds : any[] = APIConstant.commonLocationsList.map((e:any)=>(e.id))
  locations : any[] = APIConstant.commonLocationsList;
  @Output() locationsData: EventEmitter<any[]> = new EventEmitter();
  status: any = undefined;

  constructor(private lookupService: LookupService) { }

  ngOnInit(): void {

  }

  onBiltiSearch() {
    let obj = {
      "biltiNumber": this.biltiNum || "",
      locationIds: this.locationIds,
      status: this.status
    }
    this.getData.emit(obj)
  }


  onClearFilter() {
    this.biltiNum = null;
    this.locationIds = this.locationIds;
    this.status = undefined;
    let obj = {
      biltiNum: null,
      locationIds: this.locationIds,
      status: ''
    }
    this.getData.emit(obj)
  }
}
