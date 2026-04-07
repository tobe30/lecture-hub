import { useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      heading: "Excellent!",
      text: "Great learning experience! We felt very confident joining LectureHub because the classes were well structured and easy to access. The instructor explained everything clearly, and the support tools made learning feel smooth and engaging from start to finish.",
      name: "Michael Anderson",
      role: "Graphic Designer",
      avatar: "/browses.jpg",
    },
    {
      id: 2,
      heading: "Amazing platform!",
      text: "LectureHub made online classes feel organized and interactive. From attendance to live discussion, everything worked in one place. It saved time and made it easier for me to stay focused throughout the class.",
      name: "Sarah Johnson",
      role: "Computer Science Student",
      avatar: "/browses-2.png",
    },
    {
      id: 3,
      heading: "Very smooth experience",
      text: "I liked how simple it was to join classes and interact with the lecturer. The interface was clean, the sessions were stable, and it felt much better than using a generic meeting tool for learning.",
      name: "David Williams",
      role: "UI Designer",
      avatar: "/browses-3.png",
    },
  ];

  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const active = testimonials[current];

  return (
    <section id="testimonials" className="bg-[#f8f8f8] py-20">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Left image - static */}
          <div className="mx-auto w-full max-w-[430px]">
            <div className="overflow-hidden rounded-[4px]">
              <img
                src="/testimonials-4.jpg"
                alt="Student testimonial"
                className="h-[520px] w-full object-cover"
              />
            </div>
          </div>

          {/* Right content */}
          <div className="relative">
            <h2 className="max-w-[560px] text-[34px] font-extrabold leading-[1.18] tracking-[-0.03em] text-black sm:text-[42px] lg:text-[35px]">
              What Global Students Says About Our Live Online Classes
            </h2>

            <div className="mt-10 rounded-[10px] bg-[#e4edfc] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:p-10">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[18px] font-extrabold text-black">
                  {active.heading}
                </h3>

                {/* rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-[#165DFF] text-[11px] text-white"
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-6 max-w-[620px] text-[20px] italic leading-10 text-black">
                {active.text}
              </p>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={active.avatar}
                    alt={active.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-[16px] font-bold text-black">
                      {active.name}
                    </p>
                    <p className="text-[15px] text-[#6b7280]">{active.role}</p>
                  </div>
                </div>

                <Quote
                  size={38}
                  className="fill-[#165DFF] text-[#165DFF] opacity-90"
                />
              </div>
            </div>

            {/* Slider controls */}
            <div className="mt-12 flex items-center justify-center gap-8 lg:justify-start">
              <button
                onClick={prevSlide}
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#d6ddd9] bg-white transition hover:border-[#165DFF] hover:bg-[#165DFF]"
              >
                <ArrowLeft
                  className="text-black transition group-hover:text-white"
                  size={22}
                />
              </button>

              <button
                onClick={nextSlide}
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#d6ddd9] bg-white transition hover:border-[#165DFF] hover:bg-[#165DFF]"
              >
                <ArrowRight
                  className="text-black transition group-hover:text-white"
                  size={22}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}