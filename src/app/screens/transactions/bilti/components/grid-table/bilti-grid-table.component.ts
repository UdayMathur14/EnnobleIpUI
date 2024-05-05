import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';
import { BiltiService } from '../../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-bilti-grid-table',
  templateUrl: './bilti-grid-table.component.html',
  styleUrl: './bilti-grid-table.component.scss'
})
export class BiltiGridTableComponent implements OnInit {
  biltisList: any = [];
  loadSpinner: boolean = true;

  constructor(private router: Router,
    private modalService: NgbModal,
    private biltiService: BiltiService,
    private toastr: ToastrService) { }

    ngOnInit() :void{
      this.getAllBiltisList();
    }
  
  onPreviewBilti() {
    let documentModal = this.modalService.open(DeliveryNoteModalComponent, {
      size: "lg",
      backdrop: "static",
    });
    documentModal.componentInstance.title = 'Bilti';

    documentModal.result.then(
      (result) => {
          if (result) {

          }
      },
      (reason) => {
      }
  );
  }
  onEditBilti() {
    this.router.navigate(['transaction/addEditBilti']);
  }

  getAllBiltisList() {
    let data = {
      biltiNumber: '',
    };
    this.biltiService.getBiltis(data).subscribe(
      (response: any) => {
        this.biltisList = response.biltiCreations;
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      }
    );
  }
  
}
