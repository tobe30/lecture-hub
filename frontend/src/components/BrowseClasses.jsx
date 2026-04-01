import { ArrowRight } from "lucide-react";

export default function BrowseClasses() {
  const leftItems = [
    "For Lecturers",
    "Start live classes in seconds",
    "Monitor attendance in real time",
    "Manage engagement and participation",
    "Live quiz and Guide interaction",
  ];

  const rightItems = [
    "For Students",
    "Join from any device anywhere",
    "Chat with classmates during class",
    "Raise hand to ask questions",
    "Stay engaged never miss updates",
  ];

  return (
    <section className="bg-[#f7f7f8] py-20">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-14 px-4 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left content */}
        <div>
          <h2 className="max-w-[560px] text-[38px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#000] sm:text-[35px]">
                Built for everyone in the classroom
          </h2>

          <p className="mt-5 max-w-[560px] text-[18px] leading-8 text-[#5f6470]">
            Whether you teach or learn, LectureHub has you covered.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-14 gap-y-0 sm:grid-cols-2">
            <div>
              {leftItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-[#d9dde5] py-5"
                >
                  <span className="text-[17px] font-semibold text-[#165DFF]">
                    {item}
                  </span>
                  <ArrowRight size={24} className="text-[#165DFF]" />
                </div>
              ))}
            </div>

            <div>
              {rightItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-[#d9dde5] py-5"
                >
                  <span className="text-[17px] font-semibold text-[#165DFF]">
                    {item}
                  </span>
                  <ArrowRight size={24} className="text-[#165DFF]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right image area */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="aspect-square overflow-hidden rounded-full bg-[#e9edf5]">
            <img
              src="/browses.jpg"
              alt="online class tutor"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Floating avatars */}
          <div className="absolute right-[-10px] top-[32%] flex h-[62px] w-[62px] items-center justify-center rounded-full border-2 border-white bg-white shadow-lg">
            <img
              src="/browses-2.png"
              alt="student"
              className="h-[58px] w-[58px] rounded-full object-cover"
            />
          </div>

          <div className="absolute bottom-[18%] left-[-8px] flex h-[82px] w-[82px] items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
            <img
              src="/browses-3.png"
              alt="student"
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
          </div>

          <div className="absolute bottom-[4%] right-[6%] flex h-[82px] w-[82px] items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
            <img
              src="/browses-4.png"
              alt="student"
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}