import HeroCon from "@/components/HeroCon";
import Vinyl from "@/components/Vinyl";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* Vinyl: fixed in place, never scrolls */}
      <div className="fixed top-0 right-0 bottom-0 z-10 w-full md:w-[55%] lg:w-[50%] xl:w-[45%]">
        <Vinyl />
      </div>

      {/* Hero content: scrolls over the vinyl */}
      <div className="relative z-20 min-h-screen w-full pt-20 flex justify-end lg:justify-center bg-transparent">
        <div className="w-full max-w-xl mr-0 md:mr-10 lg:mr-0 text-white px-0 pl-3 lg:pl-0 lg:px-3">
          <HeroCon />
        </div>
      </div>
    </div>
  );
}
