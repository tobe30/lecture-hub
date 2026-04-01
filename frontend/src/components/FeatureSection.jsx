import { CalendarDays, MonitorPlay, BadgeCheck, Mic, MicOff, Video, PhoneOff } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
  icon: <CalendarDays size={28} strokeWidth={2} />,
  title: "Smart Class Scheduling",
  text: "LectureHub makes it easy for lecturers to schedule live classes, organize sessions, and keep students informed about upcoming lectures.",
},
{
  icon: <MonitorPlay size={28} strokeWidth={2} />,
  title: "Live Lecturer-Led Classes",
  text: "Host interactive online lectures with high-quality video, clear audio, and real-time tools that keep students engaged throughout the session.",
},
{
  icon: <BadgeCheck size={28} strokeWidth={2} />,
  title: "Reliable Classroom Experience",
  text: "From attendance tracking to smooth participation tools, LectureHub helps lecturers deliver structured and effective online learning experiences.",
},
  ];

  return (
    <section className="bg-[#f7f7f5] py-20">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-14 px-4 md:px-6 lg:grid-cols-[1.08fr_0.92fr]">
        {/* Left */}
        <div className="relative mx-auto w-full max-w-[640px]">
          <div className="overflow-hidden rounded-[6px]">
            <img
              src="/about.jpg"
              alt="Student in online class"
              className="h-auto w-full object-cover"
            />
          </div>

          {/* top left avatar */}
          <div className="absolute left-[22px] top-[74px] flex h-[56px] w-[56px] items-center justify-center rounded-full border-2 border-white bg-[#dbeafe] shadow-md">
            <img
              src="/about-2.jpg"
              alt="participant"
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
          </div>

          {/* right lower avatar */}
          <div className="absolute bottom-[140px] right-[-26px] flex h-[78px] w-[78px] items-center justify-center rounded-full border-[4px] border-[#d9f1f7] bg-[#d9f1f7] shadow-md">
            <img
              src="/about-2.png"
              alt="participant"
              className="h-[68px] w-[68px] rounded-full object-cover"
            />
          </div>

          {/* call controls */}
          <div className="absolute bottom-[28px] left-1/2 w-[86%] -translate-x-1/2 rounded-full border border-white/40 bg-black/20 px-6 py-3 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-[14px] font-medium tracking-wide">LIVE</span>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
                  <MicOff size={16} />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
                  <Mic size={16} />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
                  <Video size={16} />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
                  <PhoneOff size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="max-w-[500px]">
          <h2 className="max-w-[460px] text-[34px] font-extrabold leading-[1.18] tracking-[-0.02em] text-[#000] sm:text-[36px]">
            Host and Join Live Online Classes with LectureHub
          </h2>

          <p className="mt-5 max-w-[460px] text-[18px] leading-8 text-[#5f6470]">
            LectureHub empowers lecturers to teach from anywhere while giving students a seamless way to join live lectures, interact in real time, and stay engaged.
          </p>

          <div className="mt-8 space-y-7">
            {features.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1 text-[#165DFF]">
                  {item.icon}
                </div>

                <div>
                  <h3 className="text-[20px] font-extrabold leading-tight text-[#000]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[430px] text-[16px] leading-8 text-[#5f6470]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-10 inline-flex h-[54px] items-center gap-3 rounded-full bg-[#165DFF] px-8 text-[18px] font-semibold text-[#fff] transition hover:bg-[#165DFF]">
            Get Started
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}