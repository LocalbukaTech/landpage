export type BadgeStatus = "Active" | "Banned" | "Suspended" | "Rejected" | "Pending";

interface StatusBadgeProps {
  status: BadgeStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Active: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    Banned: {
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
    },
    Rejected: {
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
    },
    Suspended: {
      bg: "bg-[#FCF7E8]",
      text: "text-[#D39B0A]",
      dot: "bg-[#D39B0A]",
    },
    Pending: {
      bg: "bg-[#FCF7E8]",
      text: "text-[#D39B0A]",
      dot: "bg-[#D39B0A]",
    },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {status}
    </span>
  );
}
