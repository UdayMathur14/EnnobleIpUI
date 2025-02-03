import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdviceTypeService } from '../../../core/service/adviceType.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-temporary-max-bilti-no',
  templateUrl: './temporary-max-bilti-no.component.html',
  styleUrl: './temporary-max-bilti-no.component.scss',
})
export class TemporaryMaxBiltiNoComponent implements OnInit {
  temporaryMaxBiltiNumber: any;
  @Input() adviceType: string = '';
  @Input() batchName: string = '';
  @Input() maxBiltiLimit: any;
  @Input() manualAllocReq: string = '';
  @Input() status: string = '';
  @Input() transactionCode: string = '';
  @Input() transactionId: number | null = null;
  @Input() locationCode: any;
  @Input() adviceId: any;
  loadSpinner: boolean = true;
  constructor(public activeModal: NgbActiveModal,
    private adviceService: AdviceTypeService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  onPressSubmit() {
    const data = {
      adviceType: this.adviceType,
      transactionTypeId: this.transactionId,
      maxBiltiNumber: parseInt(this.maxBiltiLimit),
      manualAllocationRequired: this.manualAllocReq,
      status: this.status,
      actionBy: localStorage.getItem('userId'),
      temporaryMaxBiltiNumber: parseInt(this.temporaryMaxBiltiNumber),
      batchName: this.batchName,
      transactionTypeCode: this.transactionCode,
    };
    this.adviceService.updateAdviceType(this.locationCode,this.adviceId, data).subscribe(
      (response: any) => {
        this.loadSpinner = false;
        this.toastr.success('Advice Type Updated Successfully');
        this.activeModal.close(); 
        this.router.navigate(['master/advice']);
      },
      error => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }
}
