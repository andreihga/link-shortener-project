import { SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  ChartColumn,
  LayoutDashboard,
  Link2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Link2,
    title: "Short, memorable links",
    description:
      "Turn any long URL into a clean short link that is easy to share anywhere.",
  },
  {
    icon: Zap,
    title: "Instant redirects",
    description:
      "Visitors are redirected server-side, so your links resolve quickly and reliably.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage in one place",
    description:
      "Create, edit, and remove your links from a single personal dashboard.",
  },
  {
    icon: ChartColumn,
    title: "Track performance",
    description:
      "See how your links are used so you know what is worth sharing.",
  },
  {
    icon: ShieldCheck,
    title: "Private and secure",
    description:
      "Your links belong to your account only, and only safe http and https destinations are allowed.",
  },
];

const steps = [
  { title: "Sign up", description: "Create a free account in seconds." },
  { title: "Paste your URL", description: "Add the long link you want to share." },
  { title: "Share it", description: "Copy your short link and send it anywhere." },
];

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center sm:py-28">
        <Badge variant="secondary">Link shortener</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Short links. Big impact.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Create, manage, and track short links from one simple dashboard.
          Share cleaner URLs and send visitors where they need to go, fast.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg">Get started</Button>
        </SignUpButton>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Everything you need
          </h2>
          <p className="text-muted-foreground">
            Simple tools to create and manage your links.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon
                  className="mb-2 size-6 text-primary"
                  aria-hidden="true"
                />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-16">
        <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-foreground">
          How it works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full">
                <CardHeader>
                  <Badge variant="outline">Step {index + 1}</Badge>
                  <CardTitle className="mt-2">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Ready to shorten your first link?
        </h2>
        <p className="text-muted-foreground">
          Sign up and start sharing in under a minute.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg">Create your account</Button>
        </SignUpButton>
      </section>
    </main>
  );
}
