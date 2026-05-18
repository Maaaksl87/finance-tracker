import { useState } from "react";
import type { Source } from "@/types";
import { CreateSourceDialog } from "@/components/sources/CreateSourceDialog";
import SourceContainer from "@/components/sources/SourceContainer";

const TestSourcesPage = () => {
  const [sources, setSources] = useState<Source[]>([]);

  const handleSourceCreated = (newSource: Source) => {
    setSources((prev) => [...prev, newSource]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Мої Гаманці</h1>
        <CreateSourceDialog onSuccess={handleSourceCreated} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SourceContainer />
      </div>
    </div>
  );
};

export default TestSourcesPage;
