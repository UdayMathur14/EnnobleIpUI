import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-freight-master-material-grid-table',
  templateUrl: './freight-master-material-grid-table.component.html',
  styleUrl: './freight-master-material-grid-table.component.scss'
})
export class FreightMasterMaterialGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) {}

}