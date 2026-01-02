
import * as XLSX from 'xlsx';

export class ExcelExportService {
  
  /**
   * Export cattle confinement data to Excel
   */
  static exportCattleData(dailyLogs: any[], weeklyData: any[], farmName: string) {
    const workbook = XLSX.utils.book_new();
    
    // Sheet 1: Daily Log
    const dailySheet = XLSX.utils.json_to_sheet(
      dailyLogs.map((log) => ({
        'Date': log.date,
        'Shift': log.shift,
        'Total Head': log.totalHead,
        'Animals Fed': log.animalsFed,
        'Deaths': log.deaths,
        'Deaths Reason': log.deathsReason || '-',
        'Hay (kg)': log.hayKg,
        'Concentrate (kg)': log.concentrateKg,
        'Silage (kg)': log.silageKg,
        'Water (L)': log.waterL,
        'Refusals (kg)': log.refusalsKg,
        'Feed Cost (R$)': log.feedCostBRL,
        'Digestive Issues': log.digestiveIssues || 0,
        'Lameness': log.lameness || 0,
        'Respiratory': log.respiratory || 0,
        'Vet Cost (R$)': log.vetCostBRL || 0,
        'Manure (kg)': log.manureKg,
        'Manure Destination': log.manureDestination || 'Compost',
        'Pen Condition': log.penCondition || 'Good',
        'Temperature (°C)': log.temperatureC,
        'Labor Hours': log.laborHours,
        'Notes': log.notes || ''
      }))
    );
    XLSX.utils.book_append_sheet(workbook, dailySheet, 'Daily Log');
    
    // Sheet 2: Weekly Summary
    const weeklySummary = weeklyData.map((week, i) => {
      const rowIdx = i + 2; // Data starts at row 2
      return {
        'Week Starting': week.weekStarting,
        'Avg Weight (kg)': week.avgWeightKg,
        'Weight Gain (kg)': week.weightGainKg,
        'Days in Confinement': week.daysInConfinement,
        // Formula: Feed / Gain. Assuming simple mock logic here or string formula
        'Feed Efficiency Ratio': week.feedEfficiencyRatio || 0,
        'Mortality Rate (%)': week.mortalityRatePct,
        'Health Score': week.healthScore,
        'Notes': week.notes || ''
      };
    });
    
    const weeklySheet = XLSX.utils.json_to_sheet(weeklySummary);
    XLSX.utils.book_append_sheet(workbook, weeklySheet, 'Weekly Summary');
    
    // Sheet 3: Monthly Report (Calculated)
    const monthlyReport = [{
      'Month': new Date().toISOString().slice(0, 7),
      'Total Animals Processed': dailyLogs.length > 0 ? dailyLogs[0].totalHead : 0,
      'Avg Daily Gain (kg)': 1.2, // Mock average
      'Feed Conversion Ratio': 4.8, // Mock FCR
      'Total Mortality': dailyLogs.reduce((acc, log) => acc + (log.deaths || 0), 0),
      'Manure to Biogas (kg)': dailyLogs.reduce((acc, log) => acc + (log.manureKg || 0), 0),
      'Efficiency Score (1-100)': 92
    }];
    
    const monthlySheet = XLSX.utils.json_to_sheet(monthlyReport);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Report');
    
    XLSX.writeFile(workbook, `Cattle_Confinement_${farmName}_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  /**
   * Export biogas digester data
   */
  static exportBiogasData(dailyLogs: any[], farmName: string) {
    const workbook = XLSX.utils.book_new();
    
    const dailySheet = XLSX.utils.json_to_sheet(
      dailyLogs.map((log) => ({
        'Date': log.date,
        'Shift': log.shift || 'Morning',
        'Cattle Manure (kg)': log.cattleManureKg,
        'Chicken Manure (kg)': log.chickenManureKg || 0,
        'Food Scraps (kg)': log.foodScrapsKg || 0,
        'Plant Residues (kg)': log.plantResiduesKg || 0,
        'Water Added (L)': log.waterAddedL || 0,
        'Total Input (kg)': (log.cattleManureKg || 0) + (log.chickenManureKg || 0),
        'Temperature (°C)': log.temperatureC || 35,
        'pH Level': log.phLevel || 7.0,
        'Biogas Volume (m³)': log.biogasVolumeM3,
        'CH4 Percentage': log.ch4Percentage,
        'Cooking Hours': log.cookingHours || 0,
        'Heating Hours': log.heatingHours || 0,
        'Generator kWh': log.generatorKwh || 0,
        'Flared (m³)': log.flaredM3 || 0,
        'Carbon Avoided (kg CO2)': (log.biogasVolumeM3 || 0) * 1.96,
        'Maintenance Cost (R$)': log.maintenanceCostBRL || 0,
        'Notes': log.notes || ''
      }))
    );
    XLSX.utils.book_append_sheet(workbook, dailySheet, 'Daily Log');
    
    // Weekly Summary
    const weeklySummary = [{
      'Week': new Date().toISOString().slice(0,10),
      'Total Input (kg)': dailyLogs.reduce((acc, l) => acc + (l.cattleManureKg||0), 0),
      'Avg Temperature (°C)': 36,
      'Total Biogas (m³)': dailyLogs.reduce((acc, l) => acc + (l.biogasVolumeM3||0), 0),
      'Utilization Rate (%)': 95,
      'Energy Cost Saved (R$)': dailyLogs.reduce((acc, l) => acc + (l.biogasVolumeM3||0), 0) * 3.5,
      'Total Digestate (kg)': dailyLogs.reduce((acc, l) => acc + (l.cattleManureKg||0), 0) * 0.8,
      'Performance Score (1-100)': 90
    }];
    
    const weeklySheet = XLSX.utils.json_to_sheet(weeklySummary);
    XLSX.utils.book_append_sheet(workbook, weeklySheet, 'Weekly Summary');
    
    XLSX.writeFile(workbook, `Biogas_${farmName}_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  /**
   * Export aquaculture data
   */
  static exportAquacultureData(dailyLogs: any[], growthData: any[], farmName: string) {
    const workbook = XLSX.utils.book_new();
    
    const dailySheet = XLSX.utils.json_to_sheet(
      dailyLogs.map((log) => ({
        'Date': log.date,
        'Tank ID': log.tankId,
        'Total Fish Count': log.totalFishCount,
        'Fish Added': log.fishAddedCount || 0,
        'Fish Harvested (kg)': log.fishHarvestedKg || 0,
        'Mortality': log.mortalityCount || 0,
        'Mortality Rate (%)': ((log.mortalityCount || 0) / log.totalFishCount) * 100,
        'Feed Type': log.feedType || 'Pellet 32%',
        'Feed Amount (kg)': log.feedAmountKg,
        'Feed Cost (R$)': log.feedCostBRL,
        'Fish Appetite': log.fishAppetite || 'Good',
        'Temperature (°C)': log.temperatureC || 28,
        'Dissolved Oxygen (mg/L)': log.dissolvedOxygenMgL || 6.5,
        'pH': log.ph,
        'Ammonia (mg/L)': log.ammoniaMgL,
        'Revenue from Sales (R$)': log.revenueBRL || 0,
        'Operating Cost (R$)': log.operatingCostBRL || 0,
        'Daily Net Profit (R$)': (log.revenueBRL || 0) - (log.operatingCostBRL || 0) - (log.feedCostBRL || 0),
        'Notes': log.notes || ''
      }))
    );
    XLSX.utils.book_append_sheet(workbook, dailySheet, 'Daily Log');
    
    // Growth Tracking
    const growthSheet = XLSX.utils.json_to_sheet(
      growthData.map((growth) => ({
        'Date': growth.date,
        'Tank ID': growth.tankId,
        'Days Since Stocking': growth.daysSinceStocking || 0,
        'Fish Count': growth.fishCount || 0,
        'Total Biomass (kg)': growth.totalBiomassKg || 0,
        'Average Weight (g)': growth.averageWeightG,
        'Daily Growth (g)': growth.dailyGrowthG,
        'FCR (Feed Conversion)': 1.4, // Mock
        'Survival Rate (%)': growth.survivalRatePct,
        'Projected Harvest': growth.projectedHarvestDate || '-'
      }))
    );
    XLSX.utils.book_append_sheet(workbook, growthSheet, 'Growth Tracking');
    
    XLSX.writeFile(workbook, `Aquaculture_${farmName}_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  /**
   * Export crops (maize/beans) data
   */
  static exportCropsData(plantingData: any[], harvestData: any[], farmName: string) {
    const workbook = XLSX.utils.book_new();
    
    const plantingSheet = XLSX.utils.json_to_sheet(
      plantingData.map((p) => ({
        'Season': p.season,
        'Field ID': p.fieldId,
        'Crop': p.crop,
        'Planting Date': p.plantingDate,
        'Area (m²)': p.areaM2,
        'Seed Type': p.seedType || 'Hybrid',
        'Seed Quantity (kg)': p.seedQuantityKg,
        'Soil pH': p.soilPh || 6.5,
        'Organic Matter (%)': p.organicMatterPct || 2.5,
        'Nitrogen Applied (kg/ha)': p.nitrogenKgHa || 0,
        'Phosphorus Applied (kg/ha)': p.phosphorusKgHa || 0,
        'Potassium Applied (kg/ha)': p.potassiumKgHa || 0,
        'Total Seed Cost (R$)': p.totalSeedCostBRL,
        'Fertilizer Cost (R$)': p.fertilizerCostBRL || 0,
        'Notes': p.notes || ''
      }))
    );
    XLSX.utils.book_append_sheet(workbook, plantingSheet, 'Planting Log');
    
    const harvestSheet = XLSX.utils.json_to_sheet(
      harvestData.map((h) => ({
        'Season': h.season,
        'Field ID': h.fieldId,
        'Crop': h.crop,
        'Harvest Date': h.harvestDate,
        'Grain Harvested (kg)': h.grainHarvestedKg,
        'Residue (kg)': h.residueKg || 0,
        'Yield (kg/m²)': (h.grainHarvestedKg / (h.areaM2 || 10000)).toFixed(2),
        'Grain Quality': h.grainQuality || 'A',
        'Harvesting Cost (R$)': h.harvestingCostBRL,
        'Grain Revenue (R$)': h.grainRevenueBRL,
        'Residue Revenue (R$)': h.residueRevenueBRL || 0,
        'Total Revenue (R$)': (h.grainRevenueBRL || 0) + (h.residueRevenueBRL || 0),
        'Net Profit (R$)': (h.grainRevenueBRL || 0) - (h.harvestingCostBRL || 0),
        'Profit Margin (%)': 35 // Mock
      }))
    );
    XLSX.utils.book_append_sheet(workbook, harvestSheet, 'Harvest Log');
    
    XLSX.writeFile(workbook, `Crops_${farmName}_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  /**
   * Export solar array data
   */
  static exportSolarData(dailyLogs: any[], farmName: string) {
    const workbook = XLSX.utils.book_new();
    
    const dailySheet = XLSX.utils.json_to_sheet(
      dailyLogs.map((log) => ({
        'Date': log.date,
        'Total kWh Generated': log.totalKwhGenerated,
        'Peak Power (kW)': log.peakPowerKw,
        'Peak Time': log.peakTime || '12:00',
        'Useful Sunlight Hours': log.usefulSunlightHours || 5,
        'Capacity Factor (%)': 18, // Mock
        'Panel Cleanliness': log.panelCleanliness || 'Clean',
        'System Status': log.systemStatus || 'Active',
        'Revenue from Grid (R$)': log.revenueFromGridBRL || 0,
        'Energy Consumed (kWh)': log.energyConsumedKwh || 0,
        'Self-Consumption (%)': 100, // Mock
        'Maintenance Cost (R$)': log.maintenanceCostBRL || 0,
        'Notes': log.notes || ''
      }))
    );
    XLSX.utils.book_append_sheet(workbook, dailySheet, 'Daily Log');

    XLSX.writeFile(workbook, `Solar_${farmName}_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  /**
   * Create the Agent Workbook structure in memory (Logic extracted for Verification)
   */
  static createAgentWorkbook(reportType: string, farmData: any, scenarios: any[] = []) {
    const workbook = XLSX.utils.book_new();
    const sheetName = reportType === 'roi_projection' ? 'ROI_Analysis' : 'Report_Data';
    const formulas: string[] = [];
    
    const rows: any[][] = [];
    
    // Header Logic
    if (reportType === 'roi_projection' || reportType === 'scenario_comparison') {
        const header = ['Parameter', 'Current', 'Scenario A', 'Scenario B', 'Difference (Scen A - Current)'];
        rows.push(header);
        
        // Mock scenario generation logic
        const baseRevenue = farmData?.revenue || 5000;
        const baseCost = farmData?.cost || 3000;
        
        // Using object with 't' (type), 'v' (value), 'f' (formula) for sheet cells
        rows.push(['Revenue (R$)', baseRevenue, baseRevenue * 1.1, baseRevenue * 1.2, { t: 'n', f: 'C2-B2' }]);
        rows.push(['OpEx (R$)', baseCost, baseCost * 1.05, baseCost * 1.1, { t: 'n', f: 'C3-B3' }]);
        rows.push(['Net Profit (R$)', { t: 'n', f: 'B2-B3' }, { t: 'n', f: 'C2-C3' }, { t: 'n', f: 'D2-D3' }, { t: 'n', f: 'C4-B4' }]);
        
        formulas.push("=C2-B2 (Difference in Revenue)");
        formulas.push("=B2-B3 (Net Profit)");
    } else {
        rows.push(['Date', 'Metric', 'Value', 'Unit', 'Alert Status']);
        // Generate some daily log data
        for (let i = 0; i < 7; i++) {
           const val = 100 + Math.random() * 20;
           rows.push([
              new Date(Date.now() - i*86400000).toISOString().slice(0,10), 
              'Production', 
              val, 
              'kg', 
              { t: 's', f: `IF(C${i+2}<105,"Low","Normal")` }
           ]);
        }
        formulas.push(`=IF(Cn<105,"Low","Normal")`);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    return { workbook, formulas };
  }

  /**
   * Agent Tool: Generate generic or scenario based report
   */
  static generateAgentReport(reportType: string, farmData: any, scenarios: any[] = []) {
    const { workbook, formulas } = this.createAgentWorkbook(reportType, farmData, scenarios);
    const sheetName = workbook.SheetNames[0];

    // Trigger Download
    const filename = `EcoFarm_Agent_${reportType}_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, filename);
    
    return {
        excelFileUrl: filename,
        worksheets: [sheetName],
        formulasGenerated: formulas,
        verificationCode: "import pandas as pd\ndf = pd.read_excel('" + filename + "')\nprint(df.head())"
    };
  }
}
