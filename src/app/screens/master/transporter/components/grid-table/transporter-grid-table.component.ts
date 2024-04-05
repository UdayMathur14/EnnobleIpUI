import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransporterService } from '../../../../../core/service/transporter.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transporter-grid-table',
  templateUrl: './transporter-grid-table.component.html',
  styleUrl: './transporter-grid-table.component.scss'
})
export class TransporterGridTableComponent implements OnInit{
  transportersList : any = [];
  loadSpinner : boolean = true
  constructor(private router: Router,
    private toastr: ToastrService,
    private transporterService : TransporterService) {}

  ngOnInit(): void {
    this.getAllTransportersListInit();
  }

  getAllTransportersListInit() {
    let data = {
      "transporterCode": '',
      "transporterName" : ''
    }
    this.transporterService.getTransporters(data).subscribe((response: any) => {
      this.transportersList = response.transporters;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  onGoToEditTransporter(transporterId : any){
    this.router.navigate(['master/addEditTransporter', transporterId]);
  }

}