interface RecentIncreaseProps {
  phone: string;
  amount: number;
  timeAgo: string;
}

export default function RecentIncrease({
  phone,
  amount,
  timeAgo,
}: RecentIncreaseProps) {
  return (
    <div className="bg-fuliza-green-light rounded-lg p-4 text-sm">
      <div className="text-gray-700">
        <span className="font-semibold text-fuliza-green">{phone}</span> boosted limit to{' '}
        <span className="font-bold text-fuliza-green">Ksh {amount.toLocaleString()}</span>
      </div>
      <div className="text-gray-500 text-xs mt-1">{timeAgo}</div>
    </div>
  );
}
