export const filterTransactionsBySearch = (transactions, searchTerm) => {
  return transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const filterTransactionsByAmount = (transactions, amountFilter, customAmountRange) => {
  const { fromAmount, toAmount } = customAmountRange || {};

  switch (amountFilter) {
    case "0-100":
      return transactions.filter(
        (t) =>
          (t.amount_in > 0 && t.amount_in <= 100) ||
          (t.amount_out > 0 && t.amount_out <= 100)
      );
    case "101-500":
      return transactions.filter(
        (t) =>
          (t.amount_in > 100 && t.amount_in <= 500) ||
          (t.amount_out > 100 && t.amount_out <= 500)
      );
    case "501-1000":
      return transactions.filter(
        (t) =>
          (t.amount_in > 500 && t.amount_in <= 1000) ||
          (t.amount_out > 500 && t.amount_out <= 1000)
      );
    case "1001+":
      return transactions.filter(
        (t) => t.amount_in > 1000 || t.amount_out > 1000
      );
    case "Custom":
      return transactions.filter(
        (t) =>
          (t.amount_in >= fromAmount && t.amount_in <= toAmount) ||
          (t.amount_out >= fromAmount && t.amount_out <= toAmount)
      );
    default:
      return transactions;
  }

  if (amountFilter === "Custom" && customAmountRange) {
    const fromAmount = parseFloat(customAmountRange.from);
    const toAmount = parseFloat(customAmountRange.to);
    return transactions.filter(
      (t) =>
        (t.amount_in >= fromAmount && t.amount_in <= toAmount) ||
        (t.amount_out >= fromAmount && t.amount_out <= toAmount)
    );
  }
};
