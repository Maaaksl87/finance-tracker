import { useEffect, useState } from "react";
import type { Source } from "@/types";
import { getSources } from "@/api/sources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; // Іконка плюса

const TestSourcesPage = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Додати
        </Button>
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
