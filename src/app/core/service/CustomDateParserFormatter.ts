import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
 
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
 
    format(date: NgbDateStruct | null): string {
    return date
      ? `${this.formatDate(date.day)}-${this.formatDate(date.month)}-${date.year}`
      : '';
  }
 
  parse(value: string): NgbDateStruct | null {
    if (!value) return null;
    const parts = value.trim().split('-');
    if (parts.length !== 3) return null;
    return {
      day: +parts[0],
      month: +parts[1],
      year: +parts[2],
    };
  }
 
  private formatDate(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }
}