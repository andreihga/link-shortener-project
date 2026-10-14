import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await auth.protect();

  return <h1>Dashboard</h1>;
}
