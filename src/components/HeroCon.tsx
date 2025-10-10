"use client";
import React, { useEffect, useRef, useState } from "react";
import FuzzyText from "./FuzzyText";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Vinyl from "./Vinyl";

export default function HeroCon() {
  const [fontSize, setFontSize] = useState(200);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const fontObj = { value: 200 };

      // Step 1️⃣ Shrink font size over time
      gsap.to(fontObj, {
        value: 30,
        delay: 1.8,
        duration: 1.8,
        ease: "power3.inOut",
        onUpdate: () => setFontSize(fontObj.value),
        onComplete: () => {
          // Step 2️⃣ Animate containers inward & fade out except one
          const wrappers = gsap.utils.toArray<HTMLDivElement>(".fuzzy-wrapper");

          gsap.to(wrappers, {
            y: (i) => (i - 5) * -50, // stagger vertically toward center
            opacity: (i) => (i === 4 ? 1 : 0), // keep middle one visible
            scale: (i) => (i === 4 ? 1 : 0.8),
            duration: 1.6,
            ease: "power3.inOut",
            stagger: 0.05,
            onComplete: () => {
              setShowContent(true)
            }
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className=""
    >
      <div className="  w-full flex-col min-h-full mt-12">
        {[...Array(1)].map((_, i) => (
          <div key={i} className=" uppercase">
            <FuzzyText

              baseIntensity={0.1}
              hoverIntensity={2}
              enableHover={false}
              fontSize={fontSize}
            >
              Brokken Records
            </FuzzyText>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}>
            <p className="mt-8 opacity-80 font-light max-w-lg overflow-visible">2nd hand Vinyl & Listening Café
              - Electronic, experimental, funky, punky, jazzy, classy, hard & tasty
              … and more!
            </p>
            <div className="flex items-center gap-2 mt-8">
              <p className=" ml-2 flex flex-col">
                <span className=" opacity-80">- Opening hours</span>
                Wed-Sat 14-19</p>
              <p className="ml-2 flex flex-col">
                <span className="opacity-80">- Adress</span>
                Storgata 78
                Tromsø
              </p>
            </div>
            <div className="ctas mt-20  flex gap-20 mr-auto">
              <Link href={"/records"} className="border rounded-full px-8 py-3">
                Records
              </Link>
              <Link href={"/events"} className="border rounded-full px-8 py-3">
                Events
              </Link>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
