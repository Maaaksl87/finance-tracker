import { useEffect, useState } from "react";
import type { Source } from "@/types";
import { CreateSourceDialog } from "@/components/sources/CreateSourceDialog";
import SourceContainer from "@/components/sources/SourceContainer";
import { getSources } from "@/api/sources";

const TestSourcesPage = () => {
  const [sources, setSources] = useState<Source[]>([]);

  const fetchSources = async () => {
    try {
      const sourcesList = await getSources();
      setSources(sourcesList);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Мої Гаманці</h1>
        <CreateSourceDialog onSuccess={fetchSources} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SourceContainer sources={sources} onRefresh={fetchSources} />
      </div>
    </div>
  );
};

export default TestSourcesPage;
