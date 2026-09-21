/* ─────────────────────────────────────────────────────────
   COMPATIBILITY ENGINE
   A simple dummy compatibility engine for the PC builder.
───────────────────────────────────────────────────────── */

export const COMPATIBILITY_ENGINE = {
  check: (selectedParts: Record<string, any>): string[] => {
    const warnings: string[] = [];
    
    // Very basic dummy checks
    const cpu = selectedParts.cpu;
    const mobo = selectedParts.motherboard;
    
    if (cpu && mobo) {
      if (cpu.title.includes("Intel") && mobo.title.includes("X670")) {
        warnings.push("Intel CPU selected with AMD Motherboard.");
      }
      if (cpu.title.includes("AMD") && mobo.title.includes("Z790")) {
        warnings.push("AMD CPU selected with Intel Motherboard.");
      }
    }
    
    return warnings;
  }
};
