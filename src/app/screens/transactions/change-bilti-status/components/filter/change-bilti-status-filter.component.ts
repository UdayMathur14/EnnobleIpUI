import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-change-bilti-status-filter',
  templateUrl: './change-bilti-status-filter.component.html',
  styleUrl: './change-bilti-status-filter.component.scss'
})
export class ChangeBiltiStatusFilterComponent implements OnInit {
  fromDate!: NgbDateStruct | null;
  toDate!: NgbDateStruct | null;
  model!: NgbDateStruct;
  selectedFromDate: any;
  selectedToDate: any;
  batchName: any = undefined;
  biltiNumber: any = undefined;
  batchNames: string[] = [];
  today = inject(NgbCalendar).getToday();
  loadSpinner: boolean = true;
  batchNumber: any = undefined;
  status: any  = undefined;
  @Input() filters: any = [];
  commonLocations: any = [];
  locationIds : any[] = []
  locations : any[] = [];

  @Output() filterSearchObj: EventEmitter<any> = new EventEmitter();
  @Output() locationsData: EventEmitter<any[]> = new EventEmitter();

  constructor(private lookupService: LookupService){}

  ngOnInit(): void {
    this.getCommonLocations();
    this.getLocations();
  }

  onDateSelect(type: string, e: any) {
    const month = Number(e.month) < 10 ? '0' + e.month : e.month;
    const day = Number(e.day) < 10 ? '0' + e.day : e.day;
    if (type === 'fromDate') {
      this.selectedFromDate = e.year + '-' + month.toString() + '-' + day.toString();
    } else {
      this.selectedToDate = e.year + '-' + month.toString() + '-' + day.toString();
    }
  }

  getCommonLocations(){
    this.commonLocations = APIConstant.commonLocationsList;
  }

  getLocations() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'Locations';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.locations = res.lookUps.filter(
        (item: any) => item.status === 'Active' && 
        this.commonLocations.some((location: any) => location.id === item.id));
        this.locationIds = this.locations.map((e: any) => (e.id));
        this.locationsData.emit(this.locationIds);
        
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
  }

  handleSearch() {
    const filterObj = {
      "biltiNumber": this.biltiNumber || "",
      "batchNumber": this.batchNumber || "",
      "fromDate": this.selectedFromDate,
      "toDate": this.selectedToDate,
      locationIds: this.locationIds,
      "status": this.status
    }
    this.filterSearchObj.emit(filterObj)
  }

  onClearFilter(){
    this.batchNumber = undefined;
    this.fromDate = null,
    this.toDate = null,
    this.biltiNumber = undefined;
    this.selectedFromDate = null;
    this.selectedToDate = null;
    this.status = undefined;
    this.locationIds = this.locationIds;
    const filterObj = {
      batchNumber : '',
      biltiNumber : '',
      locationIds: this.locationIds,
      status: ''
    }
    this.filterSearchObj.emit(filterObj)
  }
}
