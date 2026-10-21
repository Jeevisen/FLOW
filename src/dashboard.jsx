import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Header from "./components/header";

function Dashboard() {
  const [firstName, setFirstName] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [transactionError, setTransactionError] = useState(null);

  useEffect(() => {
    let active = true;

    async function getUserName() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        if (error) console.error(error.message);
        setFirstName("");
        return;
      }

      const user = data.user;
      const name = user.user_metadata?.first_name || "User";

      setFirstName(name);
    }

    getUserName();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      setTransactionError(null);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Error fetching transactions:", error.message);
        setTransactionError("Unable to load financial data.");
      } else {
        setTransactions(data ?? []);
      }

      setLoadingTransactions(false);
    };

    fetchTransactions();

    return () => {
      active = false;
    };
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalBalance = totalIncome - totalExpenses;
  const totalTransactions = transactions.length;

  const recentTransactions = transactions.slice(0, 3);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);

  const displayValue = (value, isCurrency = true) => {
    if (loadingTransactions) return "...";
    if (transactionError) return "Unavailable";

    return isCurrency ? formatMoney(value) : value;
  };

  return (
    <div className="bg-[#080616] min-h-screen text-white pt-3 flex flex-col">

      <Header />

      <main
        className="
          w-[95%] sm:w-[90%] lg:w-[85%]
          max-w-[1200px] mx-auto
          flex-1 flex flex-col
          py-8 gap-6
        "
      >

        <div className="flex flex-col gap-2">

          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {firstName || "User"}!
          </h1>

          <p className="text-base sm:text-lg text-white/60">
            Here's your financial overview.
          </p>

        </div>

        {transactionError && (
          <p className="text-red-400 text-sm">
            {transactionError}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="relative bg-white/10 border border-white/10 rounded-2xl p-6 h-[200px]">

              <h2 className="text-white/60 text-sm">
                Total Balance
              </h2>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center break-words">
                  {displayValue(totalBalance)}
                </h1>
              </div>

            </div>

            <div className="relative bg-white/10 border border-white/10 rounded-2xl p-6 h-[200px]">

              <h2 className="text-white/60 text-sm">
                Total Income
              </h2>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-green-400/70 text-center break-words">
                  {displayValue(totalIncome)}
                </h1>
              </div>

            </div>

            <div className="relative bg-white/10 border border-white/10 rounded-2xl p-6 h-[200px]">

              <h2 className="text-white/60 text-sm">
                Total Expenses
              </h2>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-red-400/70 text-center break-words">
                  {displayValue(totalExpenses)}
                </h1>
              </div>

            </div>

            <div className="relative bg-white/10 border border-white/10 rounded-2xl p-6 h-[200px]">

              <h2 className="text-white/60 text-sm">
                Total Transactions
              </h2>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center">
                  {displayValue(totalTransactions, false)}
                </h1>
              </div>

            </div>

          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-6 h-full min-w-0">

            <h2 className="text-white/60 text-sm mb-6">
              Recent Transactions
            </h2>

            {loadingTransactions ? (
              <p className="text-white/40 text-sm">
                Loading...
              </p>
            ) : transactionError ? (
              <p className="text-red-400/70 text-sm">
                Transactions unavailable.
              </p>
            ) : recentTransactions.length === 0 ? (
              <p className="text-white/40 text-sm">
                No transactions yet.
              </p>
            ) : (
              <div className="flex flex-col gap-4">

                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 border-b border-white/10 pb-4"
                  >

                    <div className="flex flex-col gap-1 min-w-0">

                      <p className="text-white text-sm font-medium truncate">
                        {transaction.description || "Transaction"}
                      </p>

                      <p className="text-white/40 text-xs">
                        {transaction.date}
                      </p>

                    </div>

                    <p
                      className={`text-sm font-medium whitespace-nowrap ${
                        transaction.type === "income"
                          ? "text-green-400/70"
                          : "text-red-400/70"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatMoney(Number(transaction.amount))}
                    </p>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;