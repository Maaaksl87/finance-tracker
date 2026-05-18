import { useEffect, useState } from "react";
import type { Source } from "@/types";
import { getSources } from "@/api/sources";
import SourceCard from "./SourceCard";
import EditSourceDialogContainer from "./EditSourceDialogContainer";
import { deleteSource } from "@/api/sources";

export default function SourceContainer({}: {}) {
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleSourceUpdate = (updatedSource: Source) => {
    console.log(updatedSource);

    setSelectedSource(updatedSource);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    const prevSources = [...sources];

    setSources(sources.filter((source) => source._id !== id));

    try {
      await deleteSource(id);
    } catch (error) {
      console.error("Failed to delete source", error);
      setSources(prevSources); // Відновлюємо попередній стан у разі помилки
      alert("Не вдалося видалити гаманець. Спробуйте ще раз."); //TODO: Замінити alert
    }
  };

  return (
    <>
      {sources.map((source) => (
        <SourceCard
          key={source._id}
          sourceData={source}
          handleSourceUpdate={handleSourceUpdate}
          handleSourceDelete={handleDelete}
        />
      ))}
      {selectedSource && (
        <EditSourceDialogContainer
          key={selectedSource._id}
          source={selectedSource}
          open={isOpen}
          onOpenChange={setIsOpen}
          onSuccess={fetchSources}
        />
      )}
    </>
  );
}
