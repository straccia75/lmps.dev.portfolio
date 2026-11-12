import { ArrowLeft } from "lucide-react";
import { PageShell, PrimaryButton } from "./components/site";

export default function NotFound() {
  return (
    <PageShell>
      <section className="flex min-h-[calc(100dvh-12rem)] flex-col items-start justify-center py-20">
        <p className="enter mb-4 font-mono text-xs text-sky-300/90">404</p>
        <h1 className="enter text-4xl font-semibold tracking-tight text-white sm:text-5xl">This page does not exist.</h1>
        <p className="enter mt-4 max-w-md text-[15px] leading-relaxed">
          The link may be old, or the page may have moved.
        </p>
        <div className="enter mt-8">
          <PrimaryButton href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </PrimaryButton>
        </div>
      </section>
    </PageShell>
  );
}
