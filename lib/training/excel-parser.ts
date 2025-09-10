import * as XLSX from 'xlsx';

// Types for parsed training data
export interface ParsedTrainingPlan {
  title: string;
  weekNumber?: number;
  strengthDays: ParsedStrengthDay[];
  cardioDays: ParsedCardioDay[];
  guidelines: ParsedGuideline[];
}

export interface ParsedStrengthDay {
  date: string;
  dayName: string;
  sessionType: string;
  exercises: ParsedExercise[];
}

export interface ParsedExercise {
  sequence: number;
  name: string;
  plannedSets?: number;
  plannedReps: string;
  plannedRpe?: number;
  remarks?: string;
}

export interface ParsedCardioDay {
  dayName: string;
  sessionType: string;
  plannedDuration?: string;
  plannedDistance?: string;
  paceTarget?: string;
  hrTarget?: string;
  cadenceCue?: string;
  warmup?: string;
  mainSet?: string;
  cooldown?: string;
  notes?: string;
}

export interface ParsedGuideline {
  topic: string;
  guideline: string;
}

export class TrainingExcelParser {
  static parseExcelFile(file: File): Promise<ParsedTrainingPlan> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const parsedPlan = this.parseWorkbook(workbook);
          resolve(parsedPlan);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private static parseWorkbook(workbook: XLSX.WorkBook): ParsedTrainingPlan {
    const plan: ParsedTrainingPlan = {
      title: '',
      strengthDays: [],
      cardioDays: [],
      guidelines: []
    };

    // Parse each sheet
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      
      switch (sheetName.toLowerCase()) {
        case "sunith's wp":
          this.parseStrengthSheet(sheet, plan);
          break;
        case 'week plan':
          this.parseCardioSheet(sheet, plan);
          break;
        case 'fuel & safeguards':
          this.parseGuidelinesSheet(sheet, plan);
          break;
      }
    }

    return plan;
  }

  private static parseStrengthSheet(sheet: XLSX.WorkSheet, plan: ParsedTrainingPlan) {
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    
    // Extract title and week number
    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
      const row = jsonData[i];
      if (row && row.length > 1) {
        const cellValue = String(row[1] || '').trim();
        if (cellValue.includes('Workout Plan')) {
          plan.title = cellValue;
        } else if (cellValue.includes('Week') && cellValue.includes(':')) {
          plan.title = cellValue;
          const weekMatch = cellValue.match(/Week (\d+)/);
          if (weekMatch) {
            plan.weekNumber = parseInt(weekMatch[1]);
          }
        }
      }
    }

    // Parse strength days
    let currentDay: ParsedStrengthDay | null = null;
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;

      // Check if this is a day header (has date and day name)
      if (row[1] && row[3] && this.isDateString(String(row[1]))) {
        // Save previous day if it exists
        if (currentDay && currentDay.exercises.length > 0) {
          plan.strengthDays.push(currentDay);
        }

        // Start new day
        currentDay = {
          date: this.parseDate(String(row[1])),
          dayName: String(row[3]).trim(),
          sessionType: String(row[5] || '').trim(),
          exercises: []
        };
      }
      // Check if this is an exercise row (has sequence number and exercise name)
      else if (currentDay && row[4] && typeof row[4] === 'number' && row[5]) {
        const exercise: ParsedExercise = {
          sequence: row[4],
          name: String(row[5]).trim(),
          plannedSets: typeof row[6] === 'number' ? row[6] : undefined,
          plannedReps: String(row[7] || '').trim(),
          plannedRpe: typeof row[8] === 'number' ? row[8] : 
                     (typeof row[8] === 'string' && row[8].includes('-')) ? 
                     parseFloat(row[8].split('-')[0]) : undefined,
          remarks: row[9] ? String(row[9]).trim() : undefined
        };

        currentDay.exercises.push(exercise);
      }
    }

    // Don't forget the last day
    if (currentDay && currentDay.exercises.length > 0) {
      plan.strengthDays.push(currentDay);
    }
  }

  private static parseCardioSheet(sheet: XLSX.WorkSheet, plan: ParsedTrainingPlan) {
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    
    // Skip header row and parse cardio days
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;

      const cardioDay: ParsedCardioDay = {
        dayName: String(row[0] || '').trim(),
        sessionType: String(row[1] || '').trim(),
        plannedDuration: String(row[2] || '').trim(),
        plannedDistance: String(row[3] || '').trim(),
        paceTarget: String(row[4] || '').trim(),
        hrTarget: String(row[5] || '').trim(),
        cadenceCue: String(row[6] || '').trim(),
        warmup: String(row[7] || '').trim(),
        mainSet: String(row[8] || '').trim(),
        cooldown: String(row[9] || '').trim(),
        notes: String(row[10] || '').trim()
      };

      if (cardioDay.dayName && cardioDay.sessionType) {
        plan.cardioDays.push(cardioDay);
      }
    }
  }

  private static parseGuidelinesSheet(sheet: XLSX.WorkSheet, plan: ParsedTrainingPlan) {
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    
    // Skip header row and parse guidelines
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length < 2) continue;

      const guideline: ParsedGuideline = {
        topic: String(row[0] || '').trim(),
        guideline: String(row[1] || '').trim()
      };

      if (guideline.topic && guideline.guideline) {
        plan.guidelines.push(guideline);
      }
    }
  }

  private static isDateString(str: string): boolean {
    // Check for patterns like "Sep-08", "Sep 08", "2024-09-08"
    const patterns = [
      /^[A-Za-z]{3}-\d{2}$/,  // Sep-08
      /^[A-Za-z]{3}\s\d{1,2}$/, // Sep 8
      /^\d{4}-\d{2}-\d{2}$/   // 2024-09-08
    ];
    
    return patterns.some(pattern => pattern.test(str.trim()));
  }

  private static parseDate(dateStr: string): string {
    // Convert "Sep-08" format to ISO date
    const currentYear = new Date().getFullYear();
    const cleanStr = dateStr.trim();
    
    if (cleanStr.match(/^[A-Za-z]{3}-\d{2}$/)) {
      const [month, day] = cleanStr.split('-');
      const monthNum = this.getMonthNumber(month);
      if (monthNum !== -1) {
        return `${currentYear}-${String(monthNum).padStart(2, '0')}-${day}`;
      }
    }
    
    return dateStr; // Return as-is if can't parse
  }

  private static getMonthNumber(monthAbbr: string): number {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                   'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    return months.indexOf(monthAbbr.toLowerCase()) + 1;
  }
}

export default TrainingExcelParser;