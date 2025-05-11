import { StatsCard, TripCard } from "components";
import Header from "components/Header";
import React from "react";

const Dashboard = () => {
  const user = { name: "Adil" };
  const dashboardStats = {
    totalUsers: 12343,
    usersjoined: { currentMonth: 218, lastMonth: 834 },
    totalTrips: 3423,
    tripsCreated: { currentMonth: 234, lastMonth: 456 },
    userRole: { total: 334, currentMonth: 67, lastMonth: 23 },
  };

  const { totalUsers, usersjoined, totalTrips, tripsCreated, userRole } =
    dashboardStats;

  return (
    <main className="dashboard wrapper">
      <Header
        title={`welcome ${user?.name ?? "Guest"}`}
        description="Track activity, trends and popular destinations in real tieme"
      />

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={totalUsers}
            currentMonthCount={usersjoined.currentMonth}
            lastMonthCount={usersjoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Active Users"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>

      <TripCard />
    </main>
  );
};

export default Dashboard;
