export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Top left */}
      <div
        className="absolute top-0 left-0 w-96 h-96 gradient-blob-green rounded-full blur-3xl opacity-30"
        style={{ animation: 'float 6s ease-in-out infinite' }}
      />
      {/* Top right */}
      <div
        className="absolute top-20 right-0 w-96 h-96 gradient-blob-red rounded-full blur-3xl opacity-30"
        style={{ animation: 'float 8s ease-in-out infinite 1s' }}
      />
      {/* Bottom left */}
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 gradient-blob-red rounded-full blur-3xl opacity-30"
        style={{ animation: 'float 7s ease-in-out infinite 2s' }}
      />
      {/* Center */}
      <div
        className="absolute top-1/2 right-1/4 w-96 h-96 gradient-blob-green rounded-full blur-3xl opacity-20"
        style={{ animation: 'float 9s ease-in-out infinite 3s' }}
      />
    </div>
  );
}
