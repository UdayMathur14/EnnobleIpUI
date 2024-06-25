import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-columns-settings',
  templateUrl: './table-columns-settings.component.html',
  styleUrl: './table-columns-settings.component.scss'
})
export class TableColumnsSettingsComponent {

  @Input() columns: any = [];
  @Output() columnVisibilityChange = new EventEmitter<any>();

  onColumnVisibilityChange(column: any) {
    this.columnVisibilityChange.emit(column);
  }

}
