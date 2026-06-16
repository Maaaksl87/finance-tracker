import { CreateSourceDialog } from "@/components/sources/CreateSourceDialog";
import SourceContainer from "@/components/sources/SourceContainer";
import { useSources } from "@/hooks/useSources"

const TestSourcesPage = () => {
  const { data: sources = [] } = useSources()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Мої Гаманці</h1>
        <CreateSourceDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SourceContainer sources={sources} />
      </div>
    </div>
  );
};

export default TestSourcesPage;
