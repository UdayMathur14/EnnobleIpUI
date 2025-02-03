import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';
import { CommonUtility } from "../utilities/common";

@Injectable({
    providedIn: "root",
})
export class XlsxService {

    constructor() {
    }

    xlsxExport(rows: any[] = [], headers: string[] = [], fileName: string = 'Download Template') {

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true });

        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

        rows.forEach((row, index) => {
            const rowIndex = index + 2;
            XLSX.utils.sheet_add_aoa(ws, [Object.values(row)], { origin: `A${rowIndex}` });
        });

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');

        XLSX.writeFile(wb, `${fileName}.csv`);
    }

    xlsxMultipleExport(sheetsData: { [sheetName: string]: { rows: any[], headers: string[] } }, fileName: string = 'Download Template') {
    
        const wb = XLSX.utils.book_new();
        for (const [sheetName, { rows, headers }] of Object.entries(sheetsData)) {
            const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true });
            XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });
            rows.forEach((row, index) => {
                const rowIndex = index + 2;
                XLSX.utils.sheet_add_aoa(ws, [Object.values(row)], { origin: `A${rowIndex}` });
            });
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        }
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
}