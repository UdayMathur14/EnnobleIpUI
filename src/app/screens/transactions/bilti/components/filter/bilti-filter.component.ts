import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { BiltiService } from '../../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

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
  locationIds: any[] = APIConstant.locationsListDropdown.map((e: any) => (e.id));
  locations: any[] = APIConstant.locationsListDropdown;

  constructor() { }

  ngOnInit(): void {
    
  }

  onBiltiSearch() {
    let obj = {
      "biltiNumber": this.biltiNum || "",
      locationIds: this.locationIds
    }
    this.getData.emit(obj)
  }


  onClearFilter() {
    this.biltiNum = null;
    this.locationIds = [];
    let obj = {
      biltiNum: null,
      locationIds: []
    }
    this.getData.emit(obj)
  }
}
