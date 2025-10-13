"use client";
import React, { useEffect, useRef, useState } from "react";
import FuzzyText from "./FuzzyText";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroCon() {


  const [showContent, setShowContent] = useState(false);
  useEffect(() => {


    setShowContent(true)
  }, [])

  return (
    <div

      className=""
    >
      <div className="  w-full flex-col min-h-full mt-12">
        {[...Array(1)].map((_, i) => (
          <div key={i} className=" uppercase">
            <FuzzyText

              baseIntensity={0.1}
              hoverIntensity={2}
              enableHover={false}
              fontSize={20}
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
              <Link href={"/records"} className=" border rounded-full px-8 py-3">
                Records
              </Link>
              <Link href={"/events"} className="border rounded-full px-8 py-3">
                Events
              </Link>
            </div>

            <div className="mt-20 flex items-center justify-center">
              <Image src="/brokkenlogo.png" alt="" width={200} height={200} />
            </div>


          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
