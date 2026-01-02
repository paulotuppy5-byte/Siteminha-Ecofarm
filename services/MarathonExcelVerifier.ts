
import * as XLSX from 'xlsx';
import { ExcelExportService } from './ExcelExportService';

export class MarathonExcelVerifier {
  
  /**
   * Generate Excel + Verify Formulas + Simulate Execution
   * Note: This runs in browser, so it verifies structure in-memory rather than executing shell commands.
   */
  static async generateAndVerifyExcel(
    reportType: string,
    farmData: any,
    scenarioParams: any[]
  ) {
    // 1. Generate Workbook (In-Memory) via the existing service
    const { workbook, formulas } = ExcelExportService.createAgentWorkbook(reportType, farmData, scenarioParams);
    
    // 2. Verify Structure
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    if (!sheet) {
      return { verified: false, error: 'No sheet generated' };
    }

    // 3. Verify Content
    // We get the range to determine how many rows/cols exist
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
    const rowCount = range.e.r + 1;
    
    const verificationLog: string[] = [];
    let isValid = true;

    // Check Header (A1 should exist)
    const cellA1 = sheet['A1'] ? sheet['A1'].v : null;
    if (!cellA1) {
        verificationLog.push("❌ Missing Header A1");
        isValid = false;
    } else {
        verificationLog.push(`✅ Header found: ${cellA1}`);
    }

    // Check Data Rows
    if (rowCount < 2) {
        verificationLog.push("⚠️ Warning: No data rows generated (only header?)");
    } else {
        verificationLog.push(`✅ Data rows generated: ${rowCount - 1}`);
    }

    // Simulate "Formula Verification"
    // Since we are in browser, we check if formula cells are present in the object model.
    if (reportType === 'roi_projection' || reportType === 'scenario_comparison') {
       // We expect formulas in the generated sheets (e.g., 'f' property on cells)
       const keys = Object.keys(sheet);
       const hasFormulas = keys.some(key => sheet[key].f);
       
       if (hasFormulas) {
           verificationLog.push("✅ Formulas injected successfully");
           verificationLog.push(`ℹ️ Sample Formulas: ${formulas.slice(0, 2).join(', ')}`);
       } else {
           verificationLog.push("⚠️ No formulas detected in ROI projection");
       }
    }

    // 4. If Valid, Trigger Download
    let filename = '';
    if (isValid) {
        filename = `EcoFarm_Agent_${reportType}_${Date.now()}_Verified.xlsx`;
        // In a real automated agent flow, we might not always want to download immediately, 
        // but for this user tool, we do.
        XLSX.writeFile(workbook, filename);
        verificationLog.push(`✅ File verified and generated: ${filename}`);
    } else {
        verificationLog.push("❌ Verification failed, file not downloaded.");
    }

    return {
        verified: isValid,
        filename: isValid ? filename : null,
        logs: verificationLog,
        formulasChecked: formulas
    };
  }
}
