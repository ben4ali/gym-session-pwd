import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface SwipeToDeleteItemProps {
  children: React.ReactNode;
  onDeleteRequest: () => void;
  deleteLabel?: string;
  className?: string;
  disabled?: boolean;
}

export const SwipeToDeleteItem: React.FC<SwipeToDeleteItemProps> = ({
  children,
  onDeleteRequest,
  deleteLabel = 'Delete',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const snapThreshold = -40;
  const openOffset = -84;

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;

    if (info.offset.x < snapThreshold || info.velocity.x < -200) {
      // Snap open to reveal delete button
      controls.start({ x: openOffset, transition: { type: 'spring', stiffness: 400, damping: 30 } });
      setIsOpen(true);
    } else {
      // Snap closed
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
    setIsOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
    onDeleteRequest();
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden rounded-2xl group ${className}`}>
      {/* Revealed Delete Action in Background */}
      <div className="absolute inset-y-0 right-0 w-[84px] bg-red-600 flex flex-col items-center justify-center text-white z-0 select-none">
        <button
          type="button"
          onClick={handleDeleteClick}
          className="w-full h-full flex flex-col items-center justify-center gap-1 text-white hover:bg-red-700 active:bg-red-800 transition-colors"
          aria-label={deleteLabel}
        >
          <Trash2 size={18} strokeWidth={2.2} />
          <span className="text-[11px] font-medium tracking-tight uppercase">{deleteLabel}</span>
        </button>
      </div>

      {/* Foreground Swipeable Card */}
      <motion.div
        drag={disabled ? false : 'x'}
        dragDirectionLock
        dragConstraints={{ left: openOffset, right: 0 }}
        dragElastic={0.08}
        dragMomentum={false}
        animate={controls}
        style={{ x }}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (isOpen) {
            handleClose();
          }
        }}
        className="relative z-10 w-full bg-surface-2 dark:bg-surface-2-dark touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
};
