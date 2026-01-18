interface InfoBannerProps {
  message: string;
}

export default function InfoBanner({ message }: InfoBannerProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
      ℹ️ {message}
    </div>
  );
}
