import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState } from 'react'

interface SwiperProps {
  images: string[];

}

const EventsSwiper: React.FC<SwiperProps> = ({ images }) => {

  const [current, setCurrent] = useState(0);
  const [isFocus, setIsFocus] = useState(false);

  // Handler to update current index based on drag direction
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 15; // Lower threshold for easier swiping
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if ((offset < -swipeThreshold || velocity < -300) && current < images.length - 1) {
      setCurrent(current + 1);
    } else if ((offset > swipeThreshold || velocity > 300) && current > 0) {
      setCurrent(current - 1);
    }
  };

  if (images.length === 0) {
    return null;
  }
  return <div className='relative'>
    <MotionConfig transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}>
      <AnimatePresence>
        <motion.div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsFocus(true)}
          onMouseLeave={() => setIsFocus(false)}>
          {isFocus && images.length > 1 && (
            <>
              {current > 0 && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrent(current - 1);
                  }}
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
              )}
              {current < images.length - 1 && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrent(current + 1);
                  }}
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              )}
            </>
          )}

          <motion.div
            className={`flex flex-nowrap touch-pan-x ${images.length > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
            animate={{ x: `calc(-${current * 100}% - ${current * 0.25}rem)` }}
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            whileDrag={{ scale: 0.98 }}
            onDragEnd={handleDragEnd}
          >
            {images.map((image, idx) => (
              <motion.img
                key={idx}
                src={image}
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-full object-contain aspect-square flex-shrink-0"
                draggable={false}
                animate={{ opacity: idx === current ? 1 : 0.4 }}
              />
            ))}
          </motion.div>

        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  </div>
}

export default EventsSwiper