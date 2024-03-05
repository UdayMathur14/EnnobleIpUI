import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-bilti-grid-table',
  templateUrl: './bilti-grid-table.component.html',
  styleUrl: './bilti-grid-table.component.scss'
})
export class BiltiGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) { }
  onPreviewBilti() {

  }
  onEditBilti() {
    this.router.navigate(['transaction/addEditBilti']);
  }
}
