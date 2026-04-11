import { Suspense } from "react";
import VocabularyClient from "./vocabulary-client";

export default function VocabularyPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-neutral-500">Loading vocabulary...</div>}>
      <VocabularyClient />
    </Suspense>
  );
}
