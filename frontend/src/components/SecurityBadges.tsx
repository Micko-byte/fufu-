export default function SecurityBadges() {
  return (
    <div className="flex justify-center gap-6 my-6">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        🔒 <span className="font-semibold">Secure</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-700">
        🔐 <span className="font-semibold">Encrypted</span>
      </div>
    </div>
  );
}
