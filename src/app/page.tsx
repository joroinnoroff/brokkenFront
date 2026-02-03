
import HeroCon from "@/components/HeroCon";
import Vinyl from "@/components/Vinyl";


export default function Home() {
  return (
    <div className=" min-h-screen pt-20 w-full">
      <main className=" h-full ">
        <div className=" w-full ">
          <div className="absolute top-20 right-0 md:right-10 lg:right-52 xl:right-90 z-50 mix-blend-exclusion text-white px-0 pl-3 lg:pl-0 lg:px-3">
            <HeroCon />
          </div>

          <div className="absolute top-0 right-0 xl:right-[-10] z-10 h-screen overflow-hidden">
            <Vinyl />
          </div>


        </div>
      </main>

    </div>
  );
}
