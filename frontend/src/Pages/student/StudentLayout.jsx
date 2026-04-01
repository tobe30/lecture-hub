import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/student/Navbar";
import Sidebar from "../../components/student/Sidebar";


const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col">
          <Navbar />

          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>

        <div className="drawer-side z-40">
          <label
            htmlFor="dashboard-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;