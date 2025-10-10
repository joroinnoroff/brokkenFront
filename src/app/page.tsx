
import HeroCon from "@/components/HeroCon";
import Vinyl from "@/components/Vinyl";

export default function Home() {
  return (
    <div className=" min-h-screen pt-20 w-full">
      <main className=" overflow-hidden">
        <div className=" w-full ">
          <div className="absolute right-0 md:right-10 lg:right-52 xl:right-80 z-50 mix-blend-exclusion text-white px-3">
            <HeroCon />
          </div>

          <div className="absolute z-10 top-[-12px] right-0 xl:right-[-10]">
            <Vinyl />
          </div>

        </div>

      </main>

    </div>
  );
}
