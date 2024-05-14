import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import * as moment from 'moment';

@Component({
  selector: 'app-bilti-bill-process',
  templateUrl: './bilti-bill-process.component.html',
  styleUrl: './bilti-bill-process.component.scss'
})
export class BiltiBillProcessComponent implements OnInit{
  constructor(private router: Router,  private biltiBIllProService: BiltiBillProcessService,) { }

  isFilters: boolean = true;
  biltiBillProcess=[];
  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess(){
    const obj = {
      screenCode: 0,
      // fromDate: "",
      // toDate: "",
      adviceType: "",
      batchNumber: "",
      biltiNumber: ""
    }
      this.biltiBIllProService.getBiltiBillProcess(obj).subscribe((response:any)=>{
        response.biltiBillProcess.forEach((element:any) => {
          element.creationDate = moment.utc(element.creationDate).local().format("YYYY-MM-DD");
          // element.biltiBillProcessModel.biltiBillProcessDate = moment.utc(element.biltiBillProcessModel.biltiBillProcessDate).local().format("YYYY-MM-DD");
          if (element.biltiBillProcessModel) {
            element.biltiBillProcessModel.biltiBillProcessDate = moment.utc(element.biltiBillProcessModel.biltiBillProcessDate).local().format("YYYY-MM-DD");
          }
        });
        this.biltiBillProcess = response.biltiBillProcess;
        console.log(this.biltiBillProcess);
        
      })
  }

}
