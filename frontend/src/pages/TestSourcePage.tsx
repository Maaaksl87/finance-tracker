import { useEffect, useState } from "react";
import type { Source } from "@/types";
import { getSources, deleteSource } from "@/api/sources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, MoreHorizontal } from "lucide-react";
import { CreateSourceDialog } from "@/components/sources/CreateSourceDialog";
import { EditSourceDialog } from "@/components/sources/EditSourceDialog";
import { Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TestSourcesPage = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSource, setEditingSource] = useState<Source | null>(null);

  const handleSourceCreated = (newSource: Source) => {
    setSources((prev) => [...prev, newSource]);
  };

  const handleSourceDelete = async (id: string) => {
    const previousSources = [...sources];
    setSources(sources.filter((source) => source._id !== id));

    try {
      await deleteSource(id);
    } catch (error) {
      console.error("Failed to delete source", error);
      setSources(previousSources); // Відновлюємо попередній стан у разі помилки
      alert("Не вдалося видалити гаманець. Спробуйте ще раз."); //TODO: Замінити alert
    }
  };

  // Функція завантаження
  const fetchSources = async () => {
    try {
      const data = await getSources();
      setSources(data);
    } catch (error) {
      console.error("Failed to fetch sources", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Викликаємо при першому рендері
  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Мої Гаманці</h1>
        <CreateSourceDialog onSuccess={handleSourceCreated} />
      </div>
      {/* Редагування гаманця */}
      {editingSource && (
        <EditSourceDialog
          source={editingSource}
          open={!!editingSource} // Відкрито, якщо є вибраний гаманець
          onOpenChange={(open) => !open && setEditingSource(null)} // При закритті очищаємо вибір
          onSuccess={() => {
            fetchSources(); // Оновлюємо список
            setEditingSource(null); // Закриваємо
          }}
        />
      )}

      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <Card
              key={source._id}
              className="transition-shadow shadow-md bg-card hover:bg-card-hover"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{source.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                      <span className="sr-only">Відкрити меню</span>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* Пункт Редагувати */}
                    <DropdownMenuItem
                      onClick={() => setEditingSource(source)} // Встановлюємо активний гаманець
                      className="cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Редагувати
                    </DropdownMenuItem>
                    {/* Пункт Видалити */}
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer focus:text-red-600"
                      onClick={() => handleSourceDelete(source._id)}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Видалити
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-muted-foreground">₴</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-heading">
                  {source.balance.toLocaleString()} ₴
                </div>
                <p className="text-xs text-muted-foreground">Поточний баланс</p>
              </CardContent>
            </Card>
          ))}

          {sources.length === 0 && (
            <p className="py-10 text-center text-muted-foreground col-span-full">
              У вас ще немає гаманців. Створіть перший!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TestSourcesPage;
