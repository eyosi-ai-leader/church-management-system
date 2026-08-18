import {
  Radio,
  PlayCircle,
  MonitorPlay,
} from "lucide-react";

import Button from "@/components/shared/Button";

import serviceTimes from "@/data/serviceTimes";

export default function LiveStreamBanner() {

  const nextService = serviceTimes.find(
    (service) => service.featured
  );

  if (!nextService) return null;


  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        bg-gradient-to-r
        from-gray-900
        via-slate-900
        to-black
        p-8
        text-white
      "
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          {nextService.livestream && nextService.liveUrl && (
            <a
              href={nextService.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-red-500/20
                px-4
                py-2
                text-red-300
                transition-all
                duration-300
                hover:bg-red-500/30
                hover:scale-105
              "
            >

              <Radio
                size={16}
                className="animate-pulse"
              />

              <span className="font-semibold">
                LIVE STREAM
              </span>

            </a>
          )}


          <h2 className="mt-5 text-4xl font-bold">
            Worship Anywhere
          </h2>


          <p className="mt-4 max-w-xl text-gray-300">
            Can't attend in person? Join our worship service live
            from anywhere in the world.
          </p>


        </div>


        <div className="flex flex-wrap gap-4">


          {nextService.liveUrl && (
            <Button
              href={nextService.liveUrl}
              className="flex items-center gap-2"
            >

              <PlayCircle size={18} />

              Watch Live

            </Button>
          )}



          {nextService.previousSermonsUrl && (
            <Button
              href={nextService.previousSermonsUrl}
              variant="secondary"
              className="
                flex
                items-center
                gap-2
                border-white
                text-white
                hover:bg-white
                hover:text-black
              "
            >

              <MonitorPlay size={18} />

              Previous Sermons

            </Button>
          )}


        </div>


      </div>
    </section>
  );
}