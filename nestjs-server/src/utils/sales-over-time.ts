type StudentType = {
    added_at: Date;
    amount_paid: number;
    email: string;
}

type CoursesType =  {
    students: StudentType[];
    slug: string;
}[]

export const calculateWorkspaceSalesOverTime = (coursesWithStudents: CoursesType, months) => {
    const now = new Date();
    
    // Initialize an array to store sales for each month
    const salesPerMonth = Array(months).fill(0);
  
    coursesWithStudents.map(course => {
      course.students.map((student: StudentType) => {
        const addedAt = new Date(student.added_at);
        
        // Calculate the difference in months from the current date
        const monthDiff = now.getMonth() - addedAt.getMonth() + 
                          (12 * (now.getFullYear() - addedAt.getFullYear()));
  
        // If the difference is within the desired range (0 to months-1), accumulate the sales
        if (monthDiff >= 0 && monthDiff < months) {
          salesPerMonth[monthDiff] += student.amount_paid;
        }
      });
    });
  
    return salesPerMonth.reverse(); // Reverse to have the most recent month first
  };

  const getMonthAbbreviations = (months) => {
    const now = new Date();
    const abbreviations = [];
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      abbreviations.push(date.toLocaleString('en-US', { month: 'short' }));
    }
    return abbreviations.reverse(); // Reverse to match sales order
  };
  
  export const calculateSalesWithMonths = (coursesWithStudents: CoursesType, months: number) => {
    const sales = calculateWorkspaceSalesOverTime(coursesWithStudents, months);
    const monthAbbreviations = getMonthAbbreviations(months);
  
    // Pair sales with month abbreviations and sort by sales
    const salesWithMonths = sales
      .map((sale, index) => ({ month: monthAbbreviations[index], sales: sale })); // Sort by sales in descending order
  
    // Separate the sorted data back into arrays
    const sales_over_time = salesWithMonths.map(item => item.sales);
    const months_by_sales = salesWithMonths.map(item => item.month);
  
    return { sales_over_time, months_by_sales };
  };