

// Format price based on currency
export const formatPrice = (price: number, currency: string): string => {
  switch (currency) {
    case 'USD': return `$${price}`;
    case 'EUR': return `€${price}`;
    case 'GBP': return `£${price}`;
    case 'AUD': return `A$${price}`;
    default: return `${price} ${currency}`;
  }
};
