
export function calculateDueDates(recurrence, academicYearStartMonth) {
    const currentDate = new Date();
    let academicYearStart = new Date(currentDate.getFullYear(), academicYearStartMonth, 1);
  
    if (currentDate < academicYearStart) {
      academicYearStart.setFullYear(academicYearStart.getFullYear() - 1);
    }
  
    const dueDates = [];
  
    switch (recurrence) {
      case "monthly":
        for (let i = 0; i < 12; i++) {
          dueDates.push(new Date(academicYearStart.getFullYear(), academicYearStart.getMonth() + i, 15));
        }
        break;
      case "quarterly":
        for (let i = 0; i < 12; i += 3) {
          dueDates.push(new Date(academicYearStart.getFullYear(), academicYearStart.getMonth() + i, 15));
        }
        break;
      case "halfyearly":
        dueDates.push(new Date(academicYearStart.getFullYear(), academicYearStart.getMonth(), 15));
        dueDates.push(new Date(academicYearStart.getFullYear(), academicYearStart.getMonth() + 6, 1));
        break;
      case "annually":
        dueDates.push(new Date(academicYearStart.getFullYear() + 1, academicYearStart.getMonth() - 1, 15));
        break;
      default:
        throw new Error(`Unknown recurrence type: ${recurrence}`);
    }
  
    return dueDates;
  }