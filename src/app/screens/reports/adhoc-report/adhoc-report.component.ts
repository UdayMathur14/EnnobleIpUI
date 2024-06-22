import { Component, OnInit, inject } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AdhocReportService } from '../../../core/service/adhocReport.service';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-adhoc-report',
  templateUrl: './adhoc-report.component.html',
  styleUrl: './adhoc-report.component.scss'
})
export class AdhocReportComponent implements OnInit {
  loadSpinner: boolean = true;
  colFiltersData: any[] = [];
  columnsList: any[] = [];
  filtersList: any[] = [];
  reportFilters: any[] = [];
  leftSelections: any[] = [];
  rightSelections: any[] = [];
  selectedColumnsList: any[] = [];
  masterSelectedFilters : any[] = [];
  masterSelectedFiltersValue : any[] = [];
  today = inject(NgbCalendar).getToday();
  selectedFromDate: string = '';
  constructor(private adhocReportService: AdhocReportService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getReportData();
  }

  // trackByIndex = (index: number): number => {
  //   return index;
  // };

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedColumnsList, event.previousIndex, event.currentIndex);
  }

  getReportData() {
    this.adhocReportService.getReportColumnDropdown('').subscribe((response: any) => {
      this.colFiltersData = response.adHocReportsColumnFilter;
      this.columnsList = response.adHocReportsColumnFilter.filter((e: any) => e.type === "C");
      this.filtersList = response.adHocReportsColumnFilter.filter((e: any) => e.type === "F");
      this.reportFilters = response.filters;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onSingleSelect() {
    this.selectedColumnsList = this.selectedColumnsList.concat(this.leftSelections);
    this.leftSelections.forEach(e => {
      const ind = this.columnsList.findIndex(element => element.columnName == e.columnName);
      this.columnsList.splice(ind, 1);
    })
    
    this.leftSelections = [];
  }

  onSelectAll() {
    this.selectedColumnsList = this.colFiltersData.filter((e: any) => e.type === "C");
    this.columnsList = [];
    this.leftSelections = [];
  }

  onSingleDeselect() {
    this.columnsList = this.columnsList.concat(this.rightSelections);
    this.rightSelections.forEach(e => {
      const ind = this.selectedColumnsList.findIndex(element => element.columnName == e.columnName);
      this.selectedColumnsList.splice(ind, 1);
    })
    this.rightSelections = [];
  }

  onDeselectAll() {
    this.selectedColumnsList = [];
    this.columnsList = this.colFiltersData.filter((e: any) => e.type === "C");
    this.rightSelections = [];
  }

  selectLeftList(column:any, index : number){
    if(this.leftSelections.find((e:any) => e.columnName == column.columnName)){
      let ind = this.leftSelections.findIndex( e => e.columnName == column.columnName);
      this.leftSelections.splice(ind,1);
    }else{
      this.leftSelections.push(column);
    }
  }

  selectRightList(column:any, index : number){
    if(this.rightSelections.find((e:any) => e.columnName == column.columnName)){
      let ind = this.rightSelections.findIndex( e => e.columnName == column.columnName);
      this.rightSelections.splice(ind,1);
    }else{
      this.rightSelections.push(column);
    }
  }

  getLeftHighlights(currentColumn:any){
    const data = this.leftSelections.find((e:any) => e.columnName == currentColumn.columnName);
    return data ? 'active' : ''
  }

  getRightHighlights(currentColumn:any){
    const data = this.rightSelections.find((e:any) => e.columnName == currentColumn.columnName);
    return data ? 'active' : ''
  }

  onMasterValueSelection(e:any, data:any){
      const filterValue = {
        "columnName" : data.columnName,
        "value" : e
      }
      const idx = this.masterSelectedFiltersValue.findIndex(element => element.columnName == data.columnName);
      if(idx < 0){
        this.masterSelectedFiltersValue.push(filterValue);
      }else{
        this.masterSelectedFiltersValue[idx] = filterValue; 
      }
  }

  onDateSelect(data:any, e: any) {
    const month = Number(e.month) < 10 ? '0' + e.month : e.month;
    const day = Number(e.day) < 10 ? '0' + e.day : e.day;
    this.selectedFromDate = e.year + '-' + month.toString() + '-' + day.toString();
    const filterValue = {
      "columnName" : data.columnName,
      "value" : this.selectedFromDate
    }
    this.masterSelectedFiltersValue.push(filterValue);
  }

  onGenerateReport(){
    const data = {
      "supplierName": this.masterSelectedFiltersValue.find(e => e.columnName == "SupplierName")?.value || "",
      "supplierCode": this.masterSelectedFiltersValue.find(e => e.columnName == "SupplierCode")?.value || "",
      "paymentAdviceNo": this.masterSelectedFiltersValue.find(e => e.columnName == "PaymentAdviceNo")?.value || "",
      "location": this.masterSelectedFiltersValue.find(e => e.columnName == "Location")?.value || "",
      "biltiNumber": this.masterSelectedFiltersValue.find(e => e.columnName == "BiltiNumber")?.value || "",
      "frlrNumber": this.masterSelectedFiltersValue.find(e => e.columnName == "FRLRNumber")?.value || "",
      "vehicleNumber": this.masterSelectedFiltersValue.find(e => e.columnName == "VehicleNumber")?.value || "",
      "vehicleSize": this.masterSelectedFiltersValue.find(e => e.columnName == "VehicleSize")?.value || "",
      "freightCode": this.masterSelectedFiltersValue.find(e => e.columnName == "FreightCode")?.value || "",
      "source": this.masterSelectedFiltersValue.find(e => e.columnName == "Source")?.value || "",
      "destination": this.masterSelectedFiltersValue.find(e => e.columnName == "Destination")?.value || "",
      "status": this.masterSelectedFiltersValue.find(e => e.columnName == "Status")?.value || "",
      "biltiCreationFromDate": this.masterSelectedFiltersValue.find(e => e.columnName == "BiltiCreationDate")?.value || "2000-01-01T15:13:57.562Z",
      "biltiCreationToDate": this.masterSelectedFiltersValue.find(e => e.columnName == "BiltiCreationDate")?.value || "2000-01-01T15:13:57.562Z",
      "biltiBillProcessFromDate": this.masterSelectedFiltersValue.find(e => e.columnName == "BiltiBillProcessFromDate")?.value || "2000-01-01T15:13:57.562Z",
      "biltiBillProcessToDate": this.masterSelectedFiltersValue.find(e => e.columnName == "BiltiBillProcessFromDate")?.value || "2000-01-01T15:13:57.562Z",
      "actionByMaterialTeamFromDate": this.masterSelectedFiltersValue.find(e => e.columnName == "ActionByMaterialTeamDate")?.value || "2000-01-01T15:13:57.562Z",
      "actionByMaterialTeamToDate": this.masterSelectedFiltersValue.find(e => e.columnName == "ActionByMaterialTeamDate")?.value || "2000-01-01T15:13:57.562Z",
      "actionByMaterialHeadFromDate": this.masterSelectedFiltersValue.find(e => e.columnName == "ActionByMaterialHeadDate")?.value || "2000-01-01T15:13:57.562Z",
      "actionByMaterialHeadToDate": this.masterSelectedFiltersValue.find(e => e.columnName == "ActionByMaterialHeadDate")?.value || "2000-01-01T15:13:57.562Z",
      "actionByAccountHeadFromDate": this.masterSelectedFiltersValue.find(e => e.columnName == "ActionByAccountHeadDate")?.value || "2000-01-01T15:13:57.562Z",
      "actionByAccountHeadToDate": this.masterSelectedFiltersValue.find(e => e.columnName == "ActionByAccountHeadDate")?.value || "2000-01-01T15:13:57.562Z",
    }

    this.adhocReportService.getReportData(data).subscribe((response: any) => {
      // this.partsList = response.parts;
      // this.loadSpinner = false;
    }, error => {
      // this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      // this.loadSpinner = false;
    })
  }
}
