import { useEffect, useState } from "react";
import type { Source } from "@/types";
import { getSources, deleteSource } from "@/api/sources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, MoreHorizontal } from "lucide-react";
import { CreateSourceDialog } from "@/components/sources/CreateSourceDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TestSourcesPage = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      alert("Не вдалося видалити гаманець. Спробуйте ще раз."); //todo Замінити alert
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

      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <Card
              key={source._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {source.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Відкрити меню</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* Пункт Видалити */}
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                      onClick={() => handleSourceDelete(source._id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Видалити
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-muted-foreground">₴</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {source.balance.toLocaleString()} ₴
                </div>
                <p className="text-xs text-muted-foreground">Поточний баланс</p>
              </CardContent>
            </Card>
          ))}

          {sources.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-10">
              У вас ще немає гаманців. Створіть перший!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TestSourcesPage;
