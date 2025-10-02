// Dynamic countdown to Everest expedition
export function getDaysToEverest(): number {
  // Set the target Everest expedition date
  // Assuming expedition is planned for May 2027 (typical Everest season)
  const everestDate = new Date('2027-05-15'); // Adjust this date as needed

  const today = new Date();
  const diffTime = everestDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Return the number of days, ensuring it's not negative
  return Math.max(0, diffDays);
}

// Format the countdown text
export function getEverestCountdownText(): string {
  const days = getDaysToEverest();

  if (days === 0) {
    return "Summit Day!";
  } else if (days === 1) {
    return "1 Day to Everest";
  } else {
    return `${days} Days to Everest`;
  }
}