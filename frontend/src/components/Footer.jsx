import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[#e5e7eb] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-12">
          {/* Brand */}
          <div className="max-w-[340px]">
            <div className="mb-4 mt-1">
              <img
                src="/lh-logo.png"
                alt="LectureHub logo"
                className="h-[30px] w-auto object-contain scale-[1.2] origin-left sm:h-[120px] sm:scale-[1.3] lg:h-[30px] lg:scale-[1.35]"
              />
            </div>

            <p className="text-[15px] leading-7 text-[#6b7280]">
              LectureHub is a modern virtual classroom platform that helps
              lecturers host live lectures, engage students, and manage online
              classes with ease.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe3f3] text-[#6b7280] transition hover:border-[#165DFF] hover:bg-[#165DFF] hover:text-white"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe3f3] text-[#6b7280] transition hover:border-[#165DFF] hover:bg-[#165DFF] hover:text-white"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe3f3] text-[#6b7280] transition hover:border-[#165DFF] hover:bg-[#165DFF] hover:text-white"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe3f3] text-[#6b7280] transition hover:border-[#165DFF] hover:bg-[#165DFF] hover:text-white"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-5 text-[17px] font-semibold text-[#0f172a]">
              Product
            </h3>
            <ul className="space-y-3 text-[15px] text-[#6b7280]">
              <li><a href="#" className="transition hover:text-[#165DFF]">Features</a></li>
              <li><a href="#" className="transition hover:text-[#165DFF]">How it Works</a></li>
              <li><a href="#" className="transition hover:text-[#165DFF]">Live Classes</a></li>
              <li><a href="#" className="transition hover:text-[#165DFF]">Attendance Tracking</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-[17px] font-semibold text-[#0f172a]">
              Company
            </h3>
            <ul className="space-y-3 text-[15px] text-[#6b7280]">
              <li><a href="#" className="transition hover:text-[#165DFF]">About Us</a></li>
              <li><a href="#" className="transition hover:text-[#165DFF]">Careers</a></li>
              <li><a href="#" className="transition hover:text-[#165DFF]">Blog</a></li>
              <li><a href="#" className="transition hover:text-[#165DFF]">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-5 text-[17px] font-semibold text-[#0f172a]">
              Support
            </h3>
            <ul className="space-y-3 text-[15px] text-[#6b7280]">
              <li><a href="#" className="transition hover:text-[#165DFF]">Help Center</a></li>
              <li><a href="#" className="transition hover:text-[#165DFF]">FAQs</a></li>
              <li><a href="#" className="transition hover:text-[#165DFF]">Privacy Policy</a></li>
              <li><a href="#" className="transition hover:text-[#165DFF]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e5e7eb]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-[14px] text-[#6b7280] sm:px-6 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} Marizu Inc. All rights reserved.</p>
          <p>Built for modern virtual learning.</p>
        </div>
      </div>
    </footer>
  );
}