import { GraduationCap, LayoutGrid, Target } from "lucide-react";

export default function WhyLectureHub() {
  const features = [
    {
      icon: GraduationCap,
      title: "Built specifically for education",
      description:
        "Not another generic video call tool designed around meetings. LectureHub is shaped for how real teaching works, from attendance to engagement.",
    },
    {
      icon: LayoutGrid,
      title: "More structured than video meetings",
      description:
        "Classes, attendance, chat, lesson flow, and engagement tools all live in one organized experience built for instructors and students.",
    },
    {
      icon: Target,
      title: "Teach, track, and engage in one place",
      description:
        "Everything lecturers need without jumping between multiple apps. One focused platform, less friction, and better classroom outcomes.",
    },
  ];

  return (
    <section id="solutions" className="relative overflow-hidden bg-[#f7f9ff] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.06),_transparent_45%)]" />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#2563eb]">
            Why LectureHub
          </p>

          <h2 className="mt-4 text-[35px] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#0f172a] sm:text-[54px] lg:text-[44px]">
            Not just another video tool
          </h2>

          <p className="mx-auto mt-5 max-w-[760px] text-[18px] leading-8 text-[#5f6470] sm:text-[20px]">
            Purpose-built for virtual classrooms, not adapted from generic meeting software.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group rounded-[30px] border border-[#dbe4ff] bg-white/90 p-8 shadow-[0_10px_40px_rgba(37,99,235,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(37,99,235,0.14)]"
              >
                <div className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-[#165DFF] text-white shadow-[0_10px_30px_rgba(59,130,246,0.28)]">
                  <Icon size={30} strokeWidth={2.2} />
                </div>

                <h3 className="mt-7 text-[28px] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#000] sm:text-[25px]">
                  {feature.title}
                </h3>

                <p className="mt-5 max-w-[330px] text-[17px] leading-8 text-[#5f6470]">
                  {feature.description}
                </p>

                <div className="mt-7 h-[3px] w-14 rounded-full bg-[#165DFF] opacity-80 transition duration-300 group-hover:w-20" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}