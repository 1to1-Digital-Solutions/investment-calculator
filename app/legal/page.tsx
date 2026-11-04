import type { Metadata } from "next";

import { Legal } from "../_ui/legal";

export const metadata: Metadata = {
  title: "Legal notice · Investment Calculator",
  description: "Who publishes the investment calculator, on what terms, and what it does with your data (nothing).",
};

export default function LegalPage() {
  return <Legal />;
}
