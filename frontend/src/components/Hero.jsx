import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section id="Home" className="relative overflow-hidden bg-[#f7f7f8]">
      {/* background shapes */}
      <div className="pointer-events-none absolute inset-0">
        {/* top left shape */}
        <div className="absolute -left-24 top-0 h-[220px] w-[380px] rounded-br-[180px] rounded-tl-[0px] bg-[#eef0fb] opacity-90" />

        {/* center left big blob */}
        <div className="absolute left-[120px] top-[140px] h-[340px] w-[340px] rounded-full border-[38px] border-[#eef0fb] opacity-90" />

        {/* top right big ring */}
        <div className="absolute -right-10 top-[-40px] h-[380px] w-[380px] rounded-full border-[40px] border-[#eef0fb] opacity-90" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-110px)] max-w-[1200px] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="max-w-[1000px] text-[44px] font-bold leading-[1.08] tracking-[-0.03em] text-black sm:text-[58px] md:text-[76px] lg:text-[68px] xl:text-[72px]">
          <div>Seamless</div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:gap-5">
            <span>Live</span>

            {/* avatar pill */}
            <div className="inline-flex h-[72px] items-center rounded-full border border-[#b9bcc7] bg-[#f8f8f9] px-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:h-[74px]">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
                  alt="member"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
                  alt="member"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces"
                  alt="member"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces"
                  alt="member"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
              </div>

              <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#e7efff] text-sm font-semibold text-[#165DFF]">
                +9
              </div>
            </div>

            <span>Lectures</span>
          </div>

          <div className="mt-2">for Modern Classrooms</div>
        </h1>

        <p className="mt-8 max-w-[900px] text-[18px] leading-9 text-[#5f6470] sm:text-[20px]">
         High-quality video, clear audio, and interactive classroom tools help lecturers teach effectively and keep students engaged from anywhere.
        </p>


<Link
  to="/register"
  className="mt-10 inline-flex items-center justify-center h-[56px] rounded-full bg-[#165DFF] px-20 text-[20px] font-medium text-white transition hover:bg-[#0f4fe0] sm:px-5"
>
  Get Access
</Link>
      </div>
    </section>
  );
}