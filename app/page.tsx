import Link from "next/link";
import { currentURL, vercelURL } from "./utils";
import { createDebugUrl } from "./debug";
import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "New api allow list",
    description: "This is a new api example of allow list",
    other: {
      ...(await fetchMetadata(
        new URL(
          "1-start",
          vercelURL() || "http://localhost:3000"
        )
      )),
    },
  };
}

export default async function Home() {
  const url = currentURL("/examples/new-api-allow-list");

  return (
    <div>
      New api allow list example
      <Link href={createDebugUrl(url)} className="underline">
        Debug
      </Link>
    </div>
  );
}
