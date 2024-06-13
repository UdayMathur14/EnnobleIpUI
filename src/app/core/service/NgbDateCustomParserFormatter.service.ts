import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class NgbDateCustomParserFormatterService extends NgbDateParserFormatter {
    override parse(value: string): NgbDateStruct | null {
        return value ? {
            day: parseInt(value.substring(0, 2), 10),
            month: parseInt(value.substring(3, 5), 10),
            year: parseInt(value.substring(6, 10), 10)
        } : null;
    }

    override format(date: NgbDateStruct | null): string {
        return date ? `${date.year}-${date.month}-${date.day}` : '';
    }
}