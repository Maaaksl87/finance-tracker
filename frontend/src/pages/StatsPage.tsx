import { useEffect, useState, useMemo } from "react";
import { getTransactionStats, getTransactions } from "@/api/transactions"; // 👈 Додали getTransactions
import { TransactionStats, Transaction, TransactionType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

// 👇 Імпорти для графіків
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from "recharts";

const COLORS = ["#10b981", "#ef4444", "#3b82f6"];

const StatsPage = () => {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // 👈 Зберігаємо список для графіка
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Завантажуємо паралельно і статистику, і список транзакцій
        // Беремо, наприклад, останні 100 транзакцій для графіка
        const [statsData, transactionsData] = await Promise.all([
          getTransactionStats(),
          getTransactions({ limit: 100 }) 
        ]);
        
        setStats(statsData);
        setTransactions(transactionsData.transactions);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔥 МАГІЯ: Готуємо дані для Лінійного графіка
  const lineChartData = useMemo(() => {
    // 1. Копіюємо і розвертаємо (від найстаріших до нових)
    const sorted = [...transactions].reverse();
    
    let currentBalance = 0; // Починаємо відлік змін

    return sorted.map(t => {
      // 2. Рахуємо: Дохід додає, Витрата віднімає
      const amount = t.amount;
      const isExpense = t.type === TransactionType.EXPENSE;
      const isIncome = t.type === TransactionType.INCOME;
      
      if (isIncome) currentBalance += amount;
      if (isExpense) currentBalance -= amount;
      // Переказ (Transfer) технічно не змінює загальний капітал, якщо це між своїми гаманцями,
      // але якщо ми трекаємо конкретний потік, можна вирішити, як його рахувати.
      // Поки що ігноруємо перекази в загальному графіку "Доходи/Витрати" або рахуємо як 0.

      return {
        date: format(new Date(t.date), "dd.MM"), // Формат дати для осі X (напр. 05.12)
        fullDate: format(new Date(t.date), "d MMMM yyyy", { locale: uk }), // Для тултіпа
        balance: currentBalance, // Наша точка на графіку
        amount: isExpense ? -amount : amount, // Саме значення транзакції (для довідки)
        type: t.type
      };
    });
  }, [transactions]);


  // Дані для кругової (залишаємо як було)
  const pieChartData = stats ? [
    { name: "Доходи", value: stats.totalIncome },
    { name: "Витрати", value: stats.totalExpense },
  ].filter(item => item.value > 0) : [];

  if (isLoading) return <p className="p-8 text-center text-muted-foreground">Завантаження аналітики...</p>;
  if (!stats) return <p className="p-8 text-center text-muted-foreground">Немає даних</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Аналітика</h1>

      {/* 1. КАРТКИ (Залишаємо без змін) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* ... (код карток такий самий, як був) ... */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Всього доходів</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">+{stats.totalIncome.toLocaleString()} ₴</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Всього витрат</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">-{stats.totalExpense.toLocaleString()} ₴</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Чистий потік</CardTitle></CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalIncome - stats.totalExpense >= 0 ? "text-blue-600" : "text-orange-600"}`}>
              {(stats.totalIncome - stats.totalExpense).toLocaleString()} ₴
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        
        {/* 2. ЛІНІЙНИЙ ГРАФІК (Динаміка) - ТЕ, ЩО ТИ ПРОСИВ 📉📈 */}
        <Card className="col-span-2"> {/* Розтягуємо на всю ширину */}
          <CardHeader>
            <CardTitle>Динаміка коштів (Cash Flow)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] w-full pl-0">
            {lineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    minTickGap={30} // Щоб дати не налізали одна на одну
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}₴`} 
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    labelFormatter={(label, payload) => {
                        if (payload && payload.length > 0) return payload[0].payload.fullDate;
                        return label;
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} ₴`, "Баланс"]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" // Робить лінію плавною
                    dataKey="balance" 
                    name="Накопичений підсумок"
                    stroke="#2563eb" // Синій колір
                    strokeWidth={3}
                    dot={false} // Прибираємо крапки, щоб графік був чистішим
                    activeDot={{ r: 6 }} // Крапка з'являється при наведенні
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Недостатньо даних для побудови графіка
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. КРУГОВА ДІАГРАМА (Структура) */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Структура</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => `${value.toLocaleString()} ₴`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Немає даних
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Можна додати ще один блок тут, або розтягнути кругову */}
      </div>
    </div>
  );
};

export default StatsPage;