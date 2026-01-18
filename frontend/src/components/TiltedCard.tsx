
import { useRef, useState, MouseEvent } from "react";

interface TiltedCardProps {
  imageSrc?: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string | number;
  containerWidth?: string | number;
  imageHeight?: string | number;
  imageWidth?: string | number;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  displayOverlayContent?: boolean;
  overlayContent?: React.ReactNode;
  children?: React.ReactNode;
}

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  rotateAmplitude = 12,
  scaleOnHover = 1.1,
  showMobileWarning = false,
  showTooltip = true,
  displayOverlayContent = false,
  overlayContent,
  children
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { top, left, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const xPct = x / width;
    const yPct = y / height;

    const xRot = (0.5 - yPct) * rotateAmplitude;
    const yRot = (xPct - 0.5) * rotateAmplitude;

    setRotate({ x: xRot, y: yRot });
  };

  const handleMouseEnter = () => {
    setScale(scaleOnHover);
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setScale(1);
  };

  return (
    <div
      ref={ref}
      className="tilted-card-container relative transition-transform duration-[250ms] ease-out"
      style={{
        height: containerHeight,
        width: containerWidth,
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${scale})`,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
        {/* Simple mobile warning placeholder if needed */}
        {showMobileWarning && (
            <div className="md:hidden absolute top-0 left-0 right-0 z-50 bg-yellow-100 text-yellow-800 text-xs p-1 text-center">
                Desktop recommended for 3D effect
            </div>
        )}
        
      <div 
        className="tilted-card-inner absolute inset-0 rounded-xl overflow-hidden shadow-xl"
        style={{ transform: "translateZ(0)" }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-cover"
            style={{ width: imageWidth, height: imageHeight }}
          />
        ) : (
             // If no image, maybe a background placeholder or children wrapper
             <div className="w-full h-full bg-white"></div>
        )}
        
        {displayOverlayContent && overlayContent && (
          <div className="absolute inset-0 z-10">
            {overlayContent}
          </div>
        )}
        
        {children && (
            <div className="absolute inset-0 z-10 pointer-events-none">
                 {/* Ensure children are clickable if needed by removing pointer-events-none from inner layout */}
                 {children}
            </div>
        )}

      </div>

      {showTooltip && captionText && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {captionText}
        </div>
      )}
    </div>
  );
}
