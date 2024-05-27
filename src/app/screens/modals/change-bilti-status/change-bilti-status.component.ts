import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ChangeBiltiStatusService } from '../../../core/service/change-bilti-status.service';

@Component({
  selector: 'app-change-bilti-status',
  templateUrl: './change-bilti-status.component.html',
  styleUrl: './change-bilti-status.component.scss'
})
export class ChangeBiltiStatusModalComponent implements OnInit {

  nocFileBase64 : any = '';
  remarks: string = '';
  nocFileName: string = '';
  loadSpinner: boolean = false;
  @Input() biltiData: any;
  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private changeBiltiStatusService: ChangeBiltiStatusService
  ){}

  ngOnInit(): void {

  }

  onUploadNoc(evt: any) {
    const file = evt.target.files[0];
    this.nocFileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      this.nocFileBase64 = base64String;
      this.toastr.success('NOC selected successfully', 'Success');
    };
  }

  onSubmit(){
    this.loadSpinner = true;
    const obj = {
      "id": 0,
      "actionBy": 1,
      "status": 'Active',
      "biltiCreationId": this.biltiData?.id,
      "nocFileName": this.nocFileName,
      "nocFileData": this.nocFileBase64 || "",
      "remarks": this.remarks
     }
     this.changeBiltiStatusService.changeBitltiStatus(obj).subscribe((response: any) => {
      this.activeModal.close('save');
       this.toastr.success('Bilti Status Updated Succesfully', 'Success');
       this.loadSpinner = false;
     }, error => {
 
     })
   }
}
