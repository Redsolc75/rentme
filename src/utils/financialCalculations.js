/**
 * Financial calculation utilities for Property Management
 */

/**
 * Get the fiscal year from a date
 * @param {string|Date} date - The date to extract fiscal year from
 * @returns {number} - The fiscal year (e.g., 2024, 2025)
 */
export function getFiscalYear(date) {
  if (!date) return new Date().getFullYear();
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getFullYear();
}

/**
 * Calculate the owner's expenses for a property considering who pays what
 * @param {Object} property - The property object with IBI and garbage tax info
 * @param {number} currentYear - The year to calculate for
 * @returns {number} - Total annual expenses for the owner
 */
export function calculateOwnerExpenses(property, currentYear = new Date().getFullYear()) {
  let totalExpenses = 0;
  
  // Add IBI cost if owner pays
  if (property.who_pays_ibi === 'Propietari' && property.ibi_cost_annual) {
    totalExpenses += Number(property.ibi_cost_annual);
  }
  
  // Add garbage tax if owner pays
  if (property.who_pays_garbage === 'Propietari' && property.garbage_tax_annual) {
    totalExpenses += Number(property.garbage_tax_annual);
  }
  
  return totalExpenses;
}

/**
 * Calculate total annual profit for all properties
 * Smart expense logic: only count IBI/Garbage if owner pays
 * @param {Array} properties - Array of property objects
 * @param {Array} transactions - Array of transaction objects
 * @param {number} year - The fiscal year to calculate for
 * @returns {Object} - {totalIncome, totalExpenses, netProfit}
 */
export function calculateAnnualProfit(properties = [], transactions = [], year = new Date().getFullYear()) {
  // Calculate total income from transactions
  const totalIncome = transactions
    .filter(t => t.type === 'Ingrés' && getFiscalYear(t.date) === year)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  // Calculate total expenses from transactions (repairs, other expenses, etc.)
  const transactionExpenses = transactions
    .filter(t => t.type === 'Despesa' && getFiscalYear(t.date) === year)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  // Calculate property-related expenses (IBI, garbage tax)
  const propertyExpenses = properties.reduce((sum, property) => {
    return sum + calculateOwnerExpenses(property, year);
  }, 0);
  
  const totalExpenses = transactionExpenses + propertyExpenses;
  const netProfit = totalIncome - totalExpenses;
  
  return {
    totalIncome,
    totalExpenses,
    netProfit,
    transactionExpenses,
    propertyExpenses
  };
}

/**
 * Calculate profit for a specific property
 * @param {Object} property - The property object
 * @param {Array} transactions - Array of transaction objects for this property
 * @param {number} year - The fiscal year to calculate for
 * @returns {Object} - {income, expenses, netProfit}
 */
export function calculatePropertyProfit(property, transactions = [], year = new Date().getFullYear()) {
  // Income from this property
  const income = transactions
    .filter(t => t.type === 'Ingrés' && t.property_id === property.id && getFiscalYear(t.date) === year)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  // Transaction expenses for this property
  const transactionExpenses = transactions
    .filter(t => t.type === 'Despesa' && t.property_id === property.id && getFiscalYear(t.date) === year)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  // Property-related expenses (IBI, garbage)
  const propertyExpenses = calculateOwnerExpenses(property, year);
  
  const totalExpenses = transactionExpenses + propertyExpenses;
  const netProfit = income - totalExpenses;
  
  return {
    income,
    expenses: totalExpenses,
    netProfit,
    transactionExpenses,
    propertyExpenses
  };
}
