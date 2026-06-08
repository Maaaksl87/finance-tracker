import { useState } from "react";
import type { Source, UpdateSourceDto } from "@/types";
import { updateSource } from "@/api/sources";
import EditSourceDialogCard from "./EditSourceDialogCard";

interface Props {
  source: Source;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

export default function EditSourceDialogContainer({
  source,
  open,
  onOpenChange,
  onRefresh,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<UpdateSourceDto>({
    name: source.name,
    balance: source.balance,
  });

  const handleFormChange = (field: keyof UpdateSourceDto, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateSource(source._id, {
        name: formData.name,
        balance: Number(formData.balance),
      });
      onRefresh();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update source", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditSourceDialogCard
      isLoading={isLoading}
      formData={formData}
      onFormChange={handleFormChange}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    />
  );
}
