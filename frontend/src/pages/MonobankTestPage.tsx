import { useState } from "react";

interface Account {
  id: string;
  type: string;
  balance: number;
  creditLimit: number;
  currencyCode: number;
  maskedPan: string[];
  iban: string;
}

interface Transaction {
  id: string;
  time: number;
  description: string;
  mcc: number;
  amount: number;
  balance: number;
  comment?: string;
}

interface ClientInfo {
  name: string;
  accounts: Account[];
}

const CURRENCY: Record<number, string> = {
  980: "UAH",
  840: "USD",
  978: "EUR",
};

const formatAmount = (amount: number, currencyCode: number): string => {
  const symbol = CURRENCY[currencyCode] ?? currencyCode.toString();
  const value = (amount / 100).toFixed(2);
  return `${value} ${symbol}`;
};

const formatDate = (unixTime: number): string => {
  return new Date(unixTime * 1000).toLocaleString("uk-UA");
};

export default function MonobankTest() {
  const [token, setToken] = useState("");
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchClientInfo = async () => {
    if (!token.trim()) {
      setError("Введи токен");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.monobank.ua/personal/client-info", {
        headers: { "X-Token": token },
      });
      if (!res.ok) throw new Error(`Помилка ${res.status}: ${res.statusText}`);
      const data: ClientInfo = await res.json();
      setClientInfo(data);
      if (data.accounts.length > 0) {
        setSelectedAccountId(data.accounts[0].id);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Невідома помилка");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!selectedAccountId) return;
    setLoading(true);
    setError("");

    const now = Math.floor(Date.now() / 1000);
    const month = 31 * 24 * 60 * 60;

    const periods = [
      { from: now - month * 3, to: now - month * 2 },
      { from: now - month * 2, to: now - month },
      { from: now - month, to: now },
    ];

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const allTransactions: Transaction[] = [];

    try {
      for (let i = 0; i < periods.length; i++) {
        const { from, to } = periods[i];
        const res = await fetch(
          `https://api.monobank.ua/personal/statement/${selectedAccountId}/${from}/${to}`,
          { headers: { "X-Token": token } },
        );
        if (!res.ok) throw new Error(`Помилка ${res.status}: ${res.statusText}`);
        const data: Transaction[] = await res.json();
        allTransactions.push(...data);

        if (i < periods.length - 1) {
          setError(`Завантажено період ${i + 1}/3, чекаємо 60 секунд...`);
          await delay(61_000);
        }
      }

      setError("");
      setTransactions(allTransactions);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Невідома помилка");
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount = clientInfo?.accounts.find((a) => a.id === selectedAccountId);

  return (
    <div>
      <h1>Monobank тест</h1>

      {/* Введення токена */}
      <div>
        <label>
          X-Token:{" "}
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Вставте токен з api.monobank.ua"
            style={{ width: 400 }}
          />
        </label>{" "}
        <button onClick={fetchClientInfo} disabled={loading}>
          {loading ? "Завантаження..." : "Підключитись"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Клієнт і рахунки */}
      {clientInfo && (
        <div>
          <hr />
          <p>
            <strong>Клієнт:</strong> {clientInfo.name}
          </p>

          <label>
            Рахунок:{" "}
            <select
              value={selectedAccountId}
              onChange={(e) => {
                setSelectedAccountId(e.target.value);
                setTransactions([]);
              }}
            >
              {clientInfo.accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.type} — {acc.maskedPan?.[0] ?? acc.iban} (
                  {CURRENCY[acc.currencyCode] ?? acc.currencyCode})
                </option>
              ))}
            </select>
          </label>

          {/* Баланс */}
          {selectedAccount && (
            <div>
              <hr />
              <h2>Баланс</h2>
              <p>
                <strong>Поточний:</strong>{" "}
                {formatAmount(selectedAccount.balance, selectedAccount.currencyCode)}
              </p>
              {selectedAccount.creditLimit > 0 && (
                <p>
                  <strong>Кредитний ліміт:</strong>{" "}
                  {formatAmount(
                    selectedAccount.creditLimit,
                    selectedAccount.currencyCode,
                  )}
                </p>
              )}
            </div>
          )}

          <br />
          <button onClick={fetchTransactions} disabled={loading}>
            {loading ? "Завантаження..." : "Завантажити транзакції (30 днів)"}
          </button>
        </div>
      )}

      {/* Транзакції */}
      {transactions.length > 0 && (
        <div>
          <hr />
          <h2>Транзакції ({transactions.length})</h2>
          <table border={1} cellPadding={6} cellSpacing={0}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Опис</th>
                <th>Сума</th>
                <th>Баланс після</th>
                <th>Коментар</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{formatDate(tx.time)}</td>
                  <td>{tx.description}</td>
                  <td style={{ color: tx.amount < 0 ? "red" : "green" }}>
                    {formatAmount(tx.amount, selectedAccount?.currencyCode ?? 980)}
                  </td>
                  <td>
                    {formatAmount(tx.balance, selectedAccount?.currencyCode ?? 980)}
                  </td>
                  <td>{tx.comment ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {transactions.length === 0 && clientInfo && !loading && (
        <p>Транзакцій немає або ще не завантажені</p>
      )}
    </div>
  );
}
