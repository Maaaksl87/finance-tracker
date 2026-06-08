import { useState } from "react";
import type { Source } from "@/types";
import SourceCard from "./SourceCard";
import EditSourceDialogContainer from "./editSource/EditSourceDialogContainer";
import { deleteSource } from "@/api/sources";

interface SourceContainerProps {
  sources: Source[];
  onRefresh: () => void;
}

export default function SourceContainer({ sources, onRefresh }: SourceContainerProps) {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSourceUpdate = (source: Source) => {
    setSelectedSource(source);
    setIsOpen(true);
  };

  const handleSourceDelete = async (sourceId: string) => {
    try {
      await deleteSource(sourceId);
      onRefresh();
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
        <EditSourceDialogContainer
          key={selectedSource._id}
          source={selectedSource}
          open={isOpen}
          onOpenChange={setIsOpen}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}
