import { CirclePlus, Link2, Presentation } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <CirclePlus size={34} strokeWidth={2.2} />,
      title: "Create a Class",
      description:
        "Set up your class in seconds. Schedule sessions or start teaching immediately.",
    },
    {
      number: "02",
      icon: <Link2 size={34} strokeWidth={2.2} />,
      title: "Invite Students",
      description:
        "Share a link or class code. Students join from any device — no installs needed.",
    },
    {
      number: "03",
      icon: <Presentation size={34} strokeWidth={2.2} />,
      title: "Teach Live",
      description:
        "Host lessons with video, chat, attendance, quizzes, and engagement tools.",
    },
  ];

  return (
    <section className="bg-[#f8f9fb] py-24">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#165DFF]">
            How it works
          </p>

          <h2 className="mt-4 text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#000] sm:text-[54px] lg:text-[44px]">
            Start teaching in three simple steps
          </h2>

          <p className="mt-6 text-[20px] leading-8 text-[#5f6470]">
            From setup to live session, LectureHub gets you teaching in minutes.
          </p>
        </div>

        <div className="relative mt-20">
          <div className="absolute left-[16.66%] right-[16.66%] top-[52px] hidden h-px bg-[#e6e9f2] lg:block" />

          <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="relative mx-auto mb-10 flex h-[110px] w-[110px] items-center justify-center rounded-[26px] border border-[#e3e6ef] bg-white shadow-[0_8px_20px_rgba(12,22,44,0.05)]">
                  <div className="text-[#165DFF]">{step.icon}</div>

                  <div className="absolute -right-4 -top-4 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#165DFF] text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(22,93,255,0.28)]">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-[34px] font-extrabold tracking-[-0.02em] text-[#000] sm:text-[30px]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-4 max-w-[320px] text-[19px] leading-8 text-[#5f6470]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}