import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

export class CSVExport{
    static exportAsService: ExportAsService;
    static exportAsConfig : ExportAsConfig;
    static exportToCsv (fileName : string){
        return this.exportAsService.save(CSVExport.exportAsConfig, fileName).subscribe(() => {
        });
    } 
}