import { Component, OnInit, Input, SimpleChanges} from '@angular/core';
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
  @Input()
  searchedTransporter!: any;  
  constructor(private router: Router,
    private toastr: ToastrService,
    private transporterService : TransporterService) {}

  ngOnInit(): void {
    this.getAllTransportersListInit();
  }

    //SORTING DATA FROM FILTER CHANGES
    ngOnChanges(changes: SimpleChanges): void {
      if(changes['searchedTransporter'].currentValue){
        this.getFilteredTransportersList();
      } else if(changes['searchedTransporter'].firstChange === false && changes['searchedTransporter'].currentValue === ''){
        this.getAllTransportersListInit();
      }
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

    //THIS IS EVENT EMITTED FN. WHICH CALLS WHEN WE SEARCH TRANSPORTER FROM FILTERS 
    getFilteredTransportersList() {
      let data = {
        "transporterCode": this.searchedTransporter.transCode || "",
        "transporterName" : this.searchedTransporter.transName || ""
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