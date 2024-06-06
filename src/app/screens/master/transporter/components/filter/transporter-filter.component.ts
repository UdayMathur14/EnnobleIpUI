import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TransporterService } from '../../../../../core/service/transporter.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-transporter-filter',
  templateUrl: './transporter-filter.component.html',
  styleUrl: './transporter-filter.component.scss'
})
export class TransporterFiltersComponent implements OnInit {

  @Output() transFilterObj: EventEmitter<object> = new EventEmitter();
  transportersList: any = [];
  transCode: string | undefined;
  transName: string = '';
  locations: any[] = APIConstant.locationsListDropdown;
  locationIds: any[] = [];
  

  constructor(
    private transporterService: TransporterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllTransportersListInit();
  }

  //BINDING TRANSPORTER CODE DROPDOWN
  getAllTransportersListInit() {
    let data = {
      "transporterCode": '',
      "transporterName": '',
      locationIds: this.locationIds
    }
    this.transporterService.getTransporters(data).subscribe((response: any) => {
      this.transportersList = response.transporters;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    })
  }

  onTransporterSearch() {
    let obj = {
      transName: this.transName,
      transCode: this.transCode,
      locationIds: this.locationIds
    }
    this.transFilterObj.emit(obj)
  }

  onClearFilter() {
    this.transName = '';
    this.transCode = undefined;
    let obj = {
      transName: '',
      transCode: '',
      locationIds: []
    }
    this.transFilterObj.emit(obj)
  }

}
