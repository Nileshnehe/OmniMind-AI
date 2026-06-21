export const formatChatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();

  // Reset hours to compare purely by days
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = today - targetDate;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays <= 7 && diffDays > 1) {
    return `${diffDays} days ago`;
  } else {
    // Older than 7 days
    const options = { month: 'short', day: 'numeric' };

    // If the date is from a previous year, add the year
    if (targetDate.getFullYear() < today.getFullYear()) {
      options.year = 'numeric';
    }

    return date.toLocaleDateString('en-US', options);
  }
};
