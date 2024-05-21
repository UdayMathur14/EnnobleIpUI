import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TransporterService } from '../../../../../core/service/transporter.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transporter-filter',
  templateUrl: './transporter-filter.component.html',
  styleUrl: './transporter-filter.component.scss'
})
export class TransporterFiltersComponent implements OnInit {
  transportersList: any = [];
  transCode: string | undefined;
  transName: string = '';
  @Output() transFilterObj : EventEmitter<object> = new EventEmitter();

  constructor(private transporterService: TransporterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllTransportersListInit();
  }

  //BINDING TRANSPORTER CODE DROPDOWN
  getAllTransportersListInit() {
    let data = {
      "transporterCode": '',
      "transporterName": ''
    }
    this.transporterService.getTransporters(data).subscribe((response: any) => {
      this.transportersList = response.transporters;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('\n'));
    })
  }

  onTransporterSearch(){
    let obj = {
      transName : this.transName,
      transCode : this.transCode
    }
    this.transFilterObj.emit(obj)
  }

  onClearFilter(){
    this.transName = '';
    this.transCode = undefined;
    let obj = {
      transName : '',
      transCode : ''
    }
    this.transFilterObj.emit(obj)
  }

}
