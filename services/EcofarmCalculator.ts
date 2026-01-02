
import { 
  SimulationInput, SimulationResult, SpeciesResult, 
  Species, Lab, Ingredient 
} from '../types';
import { REFERENCE_DATA } from '../constants';

export class EcofarmCalculator {
  
  private ingredients: Ingredient[];
  private species: Species[];

  constructor() {
    this.ingredients = REFERENCE_DATA.ingredients;
    this.species = REFERENCE_DATA.species;
  }

  // Formula 1: Calculate Daily Matter Intake (DMI) based on Lab Composition
  private calculateDMI(lab: Lab): number {
    return lab.composition.reduce((sum, item) => sum + item.amountKgMS, 0);
  }

  // Formula 2: Calculate Equivalent Area required
  // Area = Total MS / Productivity (Y)
  private calculateArea(totalMS: number, productivityY: number): number {
    if (productivityY === 0) return 0;
    return totalMS / productivityY;
  }

  // Tier 3: Calculate costs
  private calculateFinancials(
    lab: Lab, 
    totalMS: number, // Total MS for the GROUP per CYCLE
    dmiPerDay: number,
    numAnimals: number,
    days: number,
    overriddenCosts: Record<string, number> = {},
    dailyOutput: number = 0 // production output param
  ) {
    let feedCostPerDay = 0;

    // Calculate daily cost per animal based on ingredients
    lab.composition.forEach(comp => {
       const ingredient = this.ingredients.find(i => i.id === comp.ingredientId);
       if (ingredient) {
          const costPerKg = overriddenCosts[ingredient.id] !== undefined ? overriddenCosts[ingredient.id] : ingredient.defaultCost;
          // Note: comp.amountKgMS is Dry Matter. 
          // If price is per kg "as fed", we need to convert. 
          // Assuming defaultCost is per kg "as fed" for simplicity in this demo, 
          // or that prices are normalized to MS. 
          // Let's assume Price is per Kg of Dry Matter for this engine to simplify math.
          feedCostPerDay += comp.amountKgMS * costPerKg;
       }
    });

    const feedCostTotal = feedCostPerDay * days * numAnimals;
    const productionTotal = dailyOutput * days * numAnimals;
    
    // Cost per unit of production (e.g., Cost per liter or Cost per kg gained)
    const costPerUnit = productionTotal > 0 ? feedCostTotal / productionTotal : 0;

    return {
       feedCostTotal,
       productionTotal,
       costPerUnit
    };
  }

  public process(input: SimulationInput): SimulationResult {
    const { tier, availableAreaHa, systemProductivityY, inventory } = input;
    
    let totalFarmAreaUsed = 0;
    const results: SpeciesResult[] = [];

    // Process each group in inventory
    for (const group of inventory) {
      const speciesRef = this.species.find(s => s.id === group.speciesId);
      if (!speciesRef) continue;

      const labRef = speciesRef.labs.find(l => l.id === group.selectedLabId);
      if (!labRef) continue;

      // 1. Calculate DMI (kg MS / day)
      const dmi = this.calculateDMI(labRef);

      // 2. Calculate Totals
      const days = group.daysInSystem || speciesRef.standardDays;
      const msPerAnimal = dmi * days; // Total MS per animal per cycle
      const msTotalGroup = msPerAnimal * group.count; // Total MS for the group

      // 3. Calculate Area
      const areaPerAnimal = this.calculateArea(msPerAnimal, systemProductivityY);
      const areaTotalGroup = areaPerAnimal * group.count;

      totalFarmAreaUsed += areaTotalGroup;

      // 4. Calculate Feed Requirements (Shopping List)
      const feedSuggestions: Record<string, number> = {};
      labRef.composition.forEach(comp => {
         const ingName = this.ingredients.find(i => i.id === comp.ingredientId)?.name || comp.ingredientId;
         // Total needed = daily amount * days * animals
         feedSuggestions[ingName] = comp.amountKgMS * days * group.count;
      });

      // 5. Tier 3 Financials
      let financials = undefined;
      if (tier === 3) {
         const productionParam = input.productionParams?.[group.speciesId]?.dailyOutput || 0;
         financials = this.calculateFinancials(
            labRef, 
            msTotalGroup, 
            dmi, 
            group.count, 
            days, 
            input.ingredientCosts,
            productionParam
         );
      }

      results.push({
        speciesId: group.speciesId,
        speciesName: speciesRef.name,
        dmiPerAnimal: parseFloat(dmi.toFixed(2)),
        totalMsPerAnimal: parseFloat(msPerAnimal.toFixed(2)),
        areaHaPerAnimal: parseFloat(areaPerAnimal.toFixed(4)),
        totalAreaRequiredHa: parseFloat(areaTotalGroup.toFixed(2)),
        totalMsRequiredKg: parseFloat(msTotalGroup.toFixed(2)),
        feedSuggestions,
        financials
      });
    }

    // Tier 2 & 3: Capacity Analysis (Max Animals)
    const remainingArea = Math.max(0, availableAreaHa - totalFarmAreaUsed);
    
    // Calculate how many MORE animals of each type could fit in the remaining area
    const capacityAnalysis = results.map(r => ({
       speciesId: r.speciesId,
       // If areaPerAnimal is 0, avoid division by zero
       potentialAdditionalAnimals: r.areaHaPerAnimal > 0 ? Math.floor(remainingArea / r.areaHaPerAnimal) : 0
    }));

    // If inventory is empty but we have remaining area, let's estimate for all species
    if (capacityAnalysis.length === 0) {
       this.species.forEach(s => {
          // Use first lab as default for estimation
          const dmi = this.calculateDMI(s.labs[0]);
          const area = this.calculateArea(dmi * s.standardDays, systemProductivityY);
          if (area > 0) {
             capacityAnalysis.push({
                speciesId: s.id,
                potentialAdditionalAnimals: Math.floor(remainingArea / area)
             });
          }
       });
    }

    return {
      tier,
      resultsBySpecies: results,
      farmTotals: {
        totalAreaUsedHa: parseFloat(totalFarmAreaUsed.toFixed(2)),
        availableAreaHa: parseFloat(availableAreaHa.toFixed(2)),
        utilizationPct: availableAreaHa > 0 ? Math.round((totalFarmAreaUsed / availableAreaHa) * 100) : 0,
        status: totalFarmAreaUsed > availableAreaHa ? 'OVERLOAD' : 'OK',
        remainingAreaHa: parseFloat(remainingArea.toFixed(2))
      },
      capacityAnalysis
    };
  }
}
