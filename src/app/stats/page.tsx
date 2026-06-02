import { Suspense } from "react";
import StatsClient from "./StatsClient";

export default function StatsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-500">Memuat statistik...</div>}>
      <StatsClient />
    </Suspense>
  );
}
