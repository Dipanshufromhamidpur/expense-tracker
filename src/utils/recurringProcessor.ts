import { RecurringExpense, ExpenseInput } from '../types';

export function processRecurringExpenses(
  recurringExpenses: RecurringExpense[],
  addExpense: (exp: ExpenseInput) => Promise<void>,
  updateRecurringExpense: (id: string, updates: Partial<RecurringExpense>) => Promise<void>
) {
  const now = new Date();
  
  recurringExpenses.forEach(recurring => {
     let lastProcessed = recurring.lastProcessedDate ? new Date(recurring.lastProcessedDate) : new Date(recurring.startDate);
     const start = new Date(recurring.startDate);
     
     // Only process if start date is in the past or today
     if (start > now) return;

     // Calculate number of days/weeks/months to add based on frequency to catch up to "now"
     let iterations = 0;
     let nextDate = new Date(lastProcessed);

     // Safety limit to avoid infinite loops if dates are bad
     let maxIterations = 1000;

     while (nextDate <= now && iterations < maxIterations) {
       if (recurring.endDate && nextDate > new Date(recurring.endDate)) {
          break;
       }

       // if we are strictly after start date (or equal)
       // if lastProcessedDate did not exist, the first entry should be on start date
       const isFirstRun = !recurring.lastProcessedDate && iterations === 0;

       if (!isFirstRun) {
          // move to next cycle
          if (recurring.frequency === 'daily') {
            nextDate.setDate(nextDate.getDate() + 1);
          } else if (recurring.frequency === 'weekly') {
            nextDate.setDate(nextDate.getDate() + 7);
          } else if (recurring.frequency === 'monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1);
          } else if (recurring.frequency === 'yearly') {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
          }
       }
       
       if (recurring.endDate && nextDate > new Date(recurring.endDate)) {
          break;
       }

       if (nextDate <= now) {
          addExpense({
             amount: recurring.amount,
             currency: recurring.currency,
             category: recurring.category,
             description: recurring.name,
             date: nextDate.toISOString().split('T')[0],
             paymentMethod: recurring.paymentMethod,
             tags: recurring.tags || []
          });
          
          iterations++;
       }
     }

     if (iterations > 0 && recurring.id) {
       updateRecurringExpense(recurring.id, { lastProcessedDate: nextDate.toISOString().split('T')[0] });
     }
  });
}
