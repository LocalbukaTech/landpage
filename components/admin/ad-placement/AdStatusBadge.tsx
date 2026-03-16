// components/admin/ad-placement/AdStatusBadge.tsx
export function AdStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-green-50 text-green-600 border-green-100",
    Completed: "bg-gray-50 text-gray-600 border-gray-100",
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-[11px] font-medium border ${styles[status]}`}>
      ● {status}
    </span>
  );
}