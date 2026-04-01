import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <nav className="mx-auto flex h-[90px] max-w-[1000px] items-center justify-between px-2 lg:px-0">
        
        {/* Logo */}
{/* Logo */}
<div className="flex items-center mt-3">
  <img
    src="/lh-logo.png"
    alt="logo"
    className="h-[30px] w-auto object-contain scale-[1.4] origin-left"
  />
</div>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-7 lg:flex">
          <li>
            <a href="#" className="text-[15px] font-medium text-gray-800 hover:text-[#165DFF]">
              Home
            </a>
          </li>

          <li>
            <a href="#" className="text-[15px] font-medium text-gray-800 hover:text-[#165DFF]">
              Features
            </a>
          </li>

          <li>
            <a href="#" className="text-[15px] font-medium text-gray-800 hover:text-[#165DFF]">
              Product
            </a>
          </li>

          <li>
            <a href="#" className="text-[15px] font-medium text-gray-800 hover:text-[#165DFF]">
              Solutions
            </a>
          </li>
        </ul>

        {/* Desktop Buttons */}
       <div className="hidden items-center gap-3 lg:flex">
  <Link to="/login">
    <button className="h-[36px] rounded-full px-4 text-[14px] font-medium text-gray-700 hover:text-[#165DFF]">
      Login
    </button>
  </Link>

  <Link to="/register">
    <button className="h-[36px] rounded-full bg-[#165DFF] px-4 text-[14px] font-medium text-white hover:bg-[#0f4fe0]">
      Sign Up
    </button>
  </Link>
</div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 lg:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-6 pb-6 pt-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            <li>
              <a href="#" className="text-[15px] font-medium text-gray-800">
                Home
              </a>
            </li>

            <li>
              <a href="#" className="text-[15px] font-medium text-gray-800">
                Features
              </a>
            </li>

            <li>
              <a href="#" className="text-[15px] font-medium text-gray-800">
                Product
              </a>
            </li>

            <li>
              <a href="#" className="text-[15px] font-medium text-gray-800">
                Solutions
              </a>
            </li>
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
  <Link to="/login">
    <button className="h-[36px] rounded-full px-4 text-[14px] font-medium text-gray-700 hover:text-[#165DFF]">
      Login
    </button>
  </Link>

  <Link to="/register">
    <button className="h-[36px] rounded-full bg-[#165DFF] px-4 text-[14px] font-medium text-white hover:bg-[#0f4fe0]">
      Sign Up
    </button>
  </Link>
</div>
        </div>
      )}
    </header>
  );
}