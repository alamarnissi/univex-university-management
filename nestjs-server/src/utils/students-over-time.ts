
type workspaceStudentsType =  {
    added_at: Date;
    email: string;
}[]

export const calculateWorkspaceStudentsOverTime = (workspaceStudents: workspaceStudentsType, months: number) => {
    const now = new Date();
    
    // Initialize an array to store sales for each month
    const studentsPerMonth = Array(months).fill(0);
  
    workspaceStudents.map(student => {
        
        const addedAt = new Date(student.added_at);
        
        // Calculate the difference in months from the current date
        const monthDiff = now.getMonth() - addedAt.getMonth() + 
                          (12 * (now.getFullYear() - addedAt.getFullYear()));
  
        // If the difference is within the desired range (0 to months-1), accumulate the students
        if (monthDiff >= 0 && monthDiff < months) {
            studentsPerMonth[monthDiff] += 1;
        }
      
    });
  
    return studentsPerMonth.reverse(); // Reverse to have the most recent month first
  };

  const getMonthAbbreviations = (months: number) => {
    const now = new Date();
    const abbreviations = [];
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      abbreviations.push(date.toLocaleString('en-US', { month: 'short' }));
    }
    return abbreviations.reverse(); // Reverse to match students order
  };
  
  export const calculateStudentsKpiWithMonths = (workspaceStudents: workspaceStudentsType, months: number) => {
    const students = calculateWorkspaceStudentsOverTime(workspaceStudents, months);
    const monthAbbreviations = getMonthAbbreviations(months);
  
    // Pair students with month abbreviations and sort by students
    const studentsWithMonths = students
      .map((sale, index) => ({ month: monthAbbreviations[index], students: sale })); // Sort by students in descending order
  
    // Separate the sorted data back into arrays
    const students_over_time = studentsWithMonths.map(item => item.students);
    const months_by_students = studentsWithMonths.map(item => item.month);
  
    return { students_over_time, months_by_students };
  };