import { useState } from "react";
import type { Source } from "@/types";
import { updateSource } from "@/api/sources";
import EditSourceDialogCard from "./EditSourceDialogCard";

interface Props {
  source: Source;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
interface EditSourceFormData {
  name: string;
  balance: number;
}

export default function EditSourceDialogContainer({
  source,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(source.name);
  const [balance, setBalance] = useState(source.balance);
  const [formData, setFormData] = useState<EditSourceFormData>({
    name: source.name,
    balance: source.balance,
  });

  const handleFormChange = (field: keyof EditSourceFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateSource(source._id, { name, balance: Number(balance) });
      onSuccess(); //оновлюємо таблицю
      onOpenChange(false); // Закриваємо діалог
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
