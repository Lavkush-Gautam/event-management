import React, { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import StatsPage from "../components/admin/StatsPage";
import CreateEvent from "../components/admin/CreateEvent";
import UsersPage from "../components/admin/UserPage";
import PaymentsSummary from "../components/admin/Paymentsummary";
import RegistrationsPage from "../components/admin/RegistrationPage";
import EventList from "../components/admin/EventList";

const AdminDashBoard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

 const renderPage = () => {
  switch (activePage) {
    case "dashboard":
      return <StatsPage />;

    case "event-list":
      return <EventList />;

    case "create-event":
      return <CreateEvent />;

    case "events":
      return <div className="p-6 text-xl">Events Management Page</div>;

    case "registrations":
      return <RegistrationsPage />;

    case "users":
      return <UsersPage />;

    case "payments":
      return <PaymentsSummary />;

    default:
      return <div className="p-6 text-xl">404 Not Found</div>;
  }
};


  return (
    <div className="flex h-screen bg-gray-100 mt-20">

      {/* SIDEBAR */}
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* MOBILE TOGGLE BTN */}
        <button
          className="md:hidden p-3 m-3 bg-white shadow rounded-md w-fit"
          onClick={() => setMobileOpen(true)}
        >
          ☰
        </button>

        <div className="overflow-y-auto flex-1 p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
