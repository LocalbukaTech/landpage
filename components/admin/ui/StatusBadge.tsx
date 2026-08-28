interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({status}: StatusBadgeProps) {
  // Normalize string to PascalCase (e.g., 'pending' -> 'Pending')
  const normalizedStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : 'Pending';

  const statusMap = {
    Active: {
      bg: 'bg-green-50 dark:bg-green-950/40',
      text: 'text-green-700 dark:text-green-400',
      dot: 'bg-green-500',
    },
    Approved: {
      bg: 'bg-green-50 dark:bg-green-950/40',
      text: 'text-green-700 dark:text-green-400',
      dot: 'bg-green-500',
    },
    Pending: {
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      text: 'text-amber-700 dark:text-[#fbbe15]',
      dot: 'bg-[#fbbe15]',
    },
    Suspended: {
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      text: 'text-orange-600 dark:text-orange-400',
      dot: 'bg-orange-500',
    },
    Rejected: {
      bg: 'bg-red-50 dark:bg-red-950/40',
      text: 'text-red-600 dark:text-red-400',
      dot: 'bg-red-500',
    },
  };

  // Safe fallback if status doesn't match any key
  const styles = (statusMap as any)[normalizedStatus] || {
    bg: 'bg-gray-50 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-300',
    dot: 'bg-gray-400 dark:text-gray-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {normalizedStatus}
    </span>
  );
}
