import { useState } from "react";
import type { Source } from "@/types";
import SourceCard from "./SourceCard";
import EditSourceDialog from "./editSource/EditSourceDialog";
import { useDeleteSource } from "@/hooks/useSources";

interface SourceContainerProps {
  sources: Source[];
}

export default function SourceContainer({ sources }: SourceContainerProps) {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const { mutateAsync } = useDeleteSource();
  const [isOpen, setIsOpen] = useState(false);

  const handleSourceUpdate = (source: Source) => {
    setSelectedSource(source);
    setIsOpen(true);
  };

  const handleSourceDelete = async (sourceId: string) => {
    try {
      await mutateAsync(sourceId);

    } catch (error) {
      console.error("Failed to delete source", error);
      alert("Помилка при видаленні джерела. Спробуйте ще раз."); // todo: замінити на нормальний компонент для повідомлень про помилки
    }
  };

  return (
    <>
      {sources.map((source) => (
        <SourceCard
          key={source._id}
          sourceData={source}
          onUpdate={handleSourceUpdate}
          onDelete={handleSourceDelete}
        />
      ))}
      {selectedSource && (
        <EditSourceDialog
          key={selectedSource._id}
          source={selectedSource}
          open={isOpen}
          onOpenChange={setIsOpen}

        />
      )}
    </>
  );
}
