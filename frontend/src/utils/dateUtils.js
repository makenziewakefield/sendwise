export const filterTransactionsByDate = (transactions, option) => {
  if (option === "All") return transactions;

  const today = new Date();
  let startDate = new Date(today);

  switch (option) {
    case "Last 15 days":
      startDate.setDate(today.getDate() - 15);
      break;
    case "Last 30 days":
      startDate.setDate(today.getDate() - 30);
      break;
    case "Last 12 months":
      startDate.setMonth(today.getMonth() - 12);
      break;
    default:
      startDate.setDate(today.getDate() - 15);
  }

  return transactions.filter(
    (transaction) => new Date(transaction.date) >= startDate
  );
};

export const filterTransactionsByCustomDate = (
  transactions,
  fromDate,
  toDate
) => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= fromDate && transactionDate <= toDate;
  });
};
