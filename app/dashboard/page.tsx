import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLinksByUserId } from "@/data/links";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const { userId } = await auth.protect();
  const userLinks = await getLinksByUserId(userId);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-foreground">
        Your links
      </h1>
      {userLinks.length === 0 ? (
        <p className="text-muted-foreground">You have no links yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {userLinks.map((link) => (
            <li key={link.id}>
              <Card>
                <CardHeader>
                  <CardTitle>/{link.shortCode}</CardTitle>
                  <CardDescription className="break-all">
                    {link.originalUrl}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
