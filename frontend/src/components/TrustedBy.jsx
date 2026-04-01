import Marquee from "react-fast-marquee";

export default function TrustedBy() {
  const logos = [
    "/biu-logo.jpg",
    "/logo-funai.jpg",
    "/ui-logo.png",
    "/babcock-logo.jpg",
    "/UNILAG-LOGO.png",
  ];

  return (
    <section className="bg-[#edf5f2] py-14">
      <div className="mx-auto max-w-[1000px] px-6">

        <p className="mb-10 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
          Trusted by universities
        </p>

        <div className="relative overflow-hidden">

          {/* fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-14 bg-gradient-to-r from-[#edf5f2] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-14 bg-gradient-to-l from-[#edf5f2] to-transparent" />

          <Marquee
            speed={28}
            gradient={false}
            pauseOnHover={true}
            autoFill={true}
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="mx-5 flex h-[70px] items-center justify-center"
              >
                <img
                  src={logo}
                  alt={`partner-${index}`}
                  className="h-16 w-auto object-contain grayscale opacity-70 transition duration-300 hover:grayscale-0 hover:opacity-100"
                  draggable={false}
                />
              </div>
            ))}
          </Marquee>

        </div>
      </div>
    </section>
  );
}