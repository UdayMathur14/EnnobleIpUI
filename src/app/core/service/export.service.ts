import { Injectable } from "@angular/core";
import { ExportAsService } from "ngx-export-as";

@Injectable({
    providedIn: "root",
})
export class ExportService {

    csvExport(fileName: string) {
        const table = document.getElementById('exportableTable');
        if (table) {
            const data = this.extractTableData(table as HTMLTableElement);
            const csvContent = this.convertToCSV(data);
            this.downloadCSV(csvContent, fileName);
        } else {
            console.error('Table element not found');
        }
    }

    private extractTableData(table: HTMLTableElement): string[][] {
        const rows = Array.from(table.getElementsByTagName('tr'));
        const data: string[][] = [];

        // Get indices of columns to exclude
        const headers = Array.from(rows[0].getElementsByTagName('th'));
        const excludeIndices = headers
            .map((header, index) => header.classList.contains('no-export') ? index : -1)
            .filter(index => index !== -1);

        for (let row of rows) {
            const cells = Array.from(row.cells);
            const rowData: string[] = [];

            cells.forEach((cell, index) => {
                if (!excludeIndices.includes(index)) {
                    rowData.push(this.escapeCSVValue(cell.innerText.trim()));
                }
            });

            if (rowData.length > 0) {
                data.push(rowData);
            }
        }

        return data;
    }

    private escapeCSVValue(value: string): string {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = value.replace(/"/g, '""'); // Escape double quotes
            value = `"${value}"`; // Wrap value in double quotes
        }
        return value;
    }

    private convertToCSV(data: string[][]): string {
        return data.map(row => row.join(',')).join('\n');
    }

    private downloadCSV(csvContent: string, fileName: string) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `${fileName}.csv`);
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
