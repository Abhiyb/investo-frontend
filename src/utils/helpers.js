/**
 * Get the CSS class for a ticket status
 * @param {string} status - The ticket status
 * @returns {string} The CSS class
 */
export function getStatusClass(status) {
  if (!status) return '';
  
  switch (status) {
    case 'OPEN': return 'status-open';
    case 'RESPONDED': return 'status-responded';
    case 'CLOSED': return 'status-closed';
    case 'REOPENED': return 'status-reopened';
    default: return '';
  }
}

/**
 * Get the CSS class for a ticket priority
 * @param {string} priority - The ticket priority
 * @returns {string} The CSS class
 */
export function getPriorityClass(priority) {
  if (!priority) return '';
  
  switch (priority) {
    case 'LOW': return 'priority-low';
    case 'MEDIUM': return 'priority-medium';
    case 'HIGH': return 'priority-high';
    default: return '';
  }
}

/**
 * Format a date string
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  // For recent dates, show relative time
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // For today, show time
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    // For older dates, show full date
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}