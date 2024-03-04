import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-point-master-material-grid-table',
  templateUrl: './point-master-material-grid-table.component.html',
  styleUrl: './point-master-material-grid-table.component.scss'
})
export class PointMasterMaterialGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) {}

}