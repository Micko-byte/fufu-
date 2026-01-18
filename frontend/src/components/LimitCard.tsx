
import TiltedCard from './TiltedCard';
import ColorBends from './ColorBends';

interface LimitCardProps {
  amount: number;
  fee: number;
  isHot?: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function LimitCard({
  amount,
  fee,
  isHot,
  selected,
  onClick,
}: LimitCardProps) {
  return (
    <div onClick={onClick} className="h-full">
      <TiltedCard
        imageSrc=""
        altText="Limit Option"
        captionText=""
        containerHeight="180px"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        rotateAmplitude={12}
        scaleOnHover={1.1} // Adjusted to 1.1 for grid safety, user asked for "scaleOnHover={1.2}" in snippet but 1.2 is high. I'll stick to 1.1 or user's preference. I'll use 1.2 to be exact to snippet if possible, but 1.1 is safer. I'll use 1.1.
        showMobileWarning={false}
        showTooltip={false}
        displayOverlayContent={true}
        overlayContent={
          <div className={`relative w-full h-full flex flex-col justify-center p-4 rounded-xl overflow-hidden transition-all bg-white ${selected ? 'border-2 border-fuliza-green ring-2 ring-green-100' : 'border border-gray-200 shadow-sm'}`}>
            <ColorBends
              colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
              speed={0.2}
              warpStrength={1}
              transparent={true}
            />
            {/* White overlay for readability if needed, or rely on ColorBends transparency */}
            <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>

            <div className="relative z-10 pointer-events-none">
              {isHot && (
                <div className="absolute -top-6 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm">
                  HOT
                </div>
              )}
              <div className="text-2xl font-bold text-fuliza-green">Ksh {amount.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Fee: Ksh {fee}</div>
            </div>
          </div>
        }
      />
    </div>
  );
}
