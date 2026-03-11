import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';
import { CommonUtility } from "../utilities/common";

@Injectable({
    providedIn: "root",
})
export class XlsxService {

    constructor() {
    }

  xlsxExport(rows: any[] = [], headers: string[] = [], fileName: string = 'Download Template', colWidths: any[] = []) {
    const wb = XLSX.utils.book_new();
    
    // 1. Sirf json_to_sheet use karein, skipHeader false rakhein
    const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: false });

    // 2. Custom Headers override karein (A1 se start karke)
    if (headers.length > 0) {
        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });
    }

    // 3. Column Widths apply karein
    if (colWidths && colWidths.length > 0) {
        ws['!cols'] = colWidths;
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet');

    // 4. Sabse important: .csv ko .xlsx se badlein
    XLSX.writeFile(wb, `${fileName}.xlsx`);
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