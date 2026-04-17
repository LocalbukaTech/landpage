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
      bg: 'bg-green-50',
      text: 'text-green-700',
      dot: 'bg-green-500',
    },
    Approved: {
      // Added alias for 'approved' from backend
      bg: 'bg-green-50',
      text: 'text-green-700',
      dot: 'bg-green-500',
    },
    Pending: {
      // Added alias for 'approved' from backend
      bg: 'bg-orange-50',
      text: 'text-primary',
      dot: 'bg-primary',
    },
    Rejected: {
      bg: 'bg-red-50',
      text: 'text-red-500',
      dot: 'bg-red-500',
    },
  };

  // Safe fallback if status doesn't match any key
  const styles = (statusMap as any)[normalizedStatus] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {normalizedStatus}
    </span>
  );
}
