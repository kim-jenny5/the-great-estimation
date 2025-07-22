export const formatCurrency = (amount: number, options: { withCents?: boolean } = {}): string => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: options.withCents ? 2 : 0,
    maximumFractionDigits: options.withCents ? 2 : 0,
  });
};

// export const formatPercentage = (
//   value: number,
//   options: { withDecimals?: boolean } = {},
// ): string => {
//   return (value * 100).toLocaleString('en-US', {
//     style: 'percent',
//     minimumFractionDigits: options.withDecimals ? 2 : 0,
//     maximumFractionDigits: options.withDecimals ? 2 : 0,
//   });
// };
