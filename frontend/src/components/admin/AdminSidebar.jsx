import React, { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Users,
  Wallet,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const AdminSidebar = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {

  const [openEventsMenu, setOpenEventsMenu] = useState(false);

  const mainMenu = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "registrations", label: "Registrations", icon: Ticket },
    { key: "users", label: "Users", icon: Users },
    { key: "payments", label: "Payments", icon: Wallet },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* SIDEBAR MAIN */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full bg-white shadow-md z-30
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {!collapsed && (
            <h1 className="text-xl font-bold text-red-500">Admin Panel</h1>
          )}

          {/* DESKTOP TOGGLE */}
          <button
            className="hidden md:block p-2 hover:bg-gray-100 rounded"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* MENU */}
        <nav className="mt-4 space-y-2 px-3">

          {/* MAIN MENU ITEMS */}
          {mainMenu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => {
                  setActivePage(item.key);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 w-full p-3 rounded-md transition
                  ${
                    activePage === item.key
                      ? "bg-red-100 text-red-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
              >
                <Icon size={22} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          {/* EVENTS (NESTED MENU PARENT) */}
          <button
            onClick={() => setOpenEventsMenu((prev) => !prev)}
            className={`flex items-center justify-between w-full p-3 rounded-md transition
            ${openEventsMenu ? "bg-red-50" : "hover:bg-gray-100"}
            `}
          >
            <div className="flex items-center gap-3">
              <CalendarDays size={22} />
              {!collapsed && <span>Events</span>}
            </div>

            {/* Arrow Icon */}
            {!collapsed &&
              (openEventsMenu ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              ))}
          </button>

          {/* EVENTS SUBMENU */}
          {openEventsMenu && !collapsed && (
            <div className="ml-10 space-y-2">

              <button
                onClick={() => {
                  setActivePage("create-event");
                  setMobileOpen(false);
                }}
                className={`block w-full text-left p-2 rounded-md text-sm transition
                ${
                  activePage === "create-event"
                    ? "bg-red-200 text-red-700"
                    : "hover:bg-gray-200"
                }`}
              >
                ➤ Create Event
              </button>

              <button
                onClick={() => {
                  setActivePage("event-list");
                  setMobileOpen(false);
                }}
                className={`block w-full text-left p-2 rounded-md text-sm transition
                ${
                  activePage === "event-list"
                    ? "bg-red-200 text-red-700"
                    : "hover:bg-gray-200"
                }`}
              >
                ➤ Event List
              </button>

            </div>
          )}

        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
