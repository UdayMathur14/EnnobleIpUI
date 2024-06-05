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
        // Create a new workbook and a new worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true });

        // Add the headers as the first row
        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

        // Ensure all rows are correctly added
        rows.forEach((row, index) => {
            const rowIndex = index + 2; // Starting after headers
            XLSX.utils.sheet_add_aoa(ws, [Object.values(row)], { origin: `A${rowIndex}` });
        });

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');

        // Write the workbook to a file
        XLSX.writeFile(wb, `${fileName}.csv`);
    }
}