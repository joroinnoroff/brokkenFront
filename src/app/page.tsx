
import HeroCon from "@/components/HeroCon";
import Image from "next/image";
import { motion } from 'framer-motion'
export default function Home() {
  return (
    <div className=" min-h-screen pt-20 w-full">
      <main className=" overflow-hidden">
        <div className="overflow-x-hidden w-fit px-8">
          <HeroCon />



        </div>

      </main>

    </div>
  );
}
