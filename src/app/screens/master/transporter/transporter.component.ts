import { Component } from '@angular/core';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-transporter',
  templateUrl: './transporter.component.html',
  styleUrl: './transporter.component.scss'
})
export class TransporterComponent {

  searchedTransporter: any;
  isFilters: boolean = true;
  fullScreen : boolean = false;
  transporterList: any [] = [];
  headers: string[] = [];

  constructor(private xlsxService: XlsxService) { }

  searchTransporter(event: any) {
    this.searchedTransporter = event;
  }

  onTransportersListChange(transporterList: any[]) {
    this.transporterList = transporterList;
  }

  onHeadersChange(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Transporter") {
    // Map the data to include only the necessary fields
    const mappedTransporterList = this.transporterList.map(transporter => ({
      transporterCode: transporter.transporterCode,
      transporterName: transporter.transporterName,
      locationId: transporter.locationId,
      consignorName: transporter.consignorName,
      ownerName: transporter.ownerName,
      contactPerson: transporter.contactPerson,
      transporterAddress1: transporter.transporterAddress1 + ", " +transporter.transporterAddress2,
      transporterContactNo: transporter.transporterContactNo,
      transporterMailId: transporter.transporterMailId,
      regdDetails: transporter.regdDetails,
      status: transporter.status,
      autoBiltiRequiredFlag: transporter.autoBiltiRequiredFlag
    }));
    this.xlsxService.xlsxExport(mappedTransporterList, this.headers, fileName);
  }
}