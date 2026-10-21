
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/header";

function Add({ onClose, onSaved }) {

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    const now = new Date();
    const localDate = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().slice(0, 10);
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    const value = Number(amount);

    if (
      !amount ||
      !Number.isFinite(value) ||
      value <= 0 ||
      !date
    ) {
      alert("Please enter a valid amount and date.");
      return;
    }

    if (Math.round(value * 100) !== value * 100 &&
        Math.abs(Math.round(value * 100) - value * 100) > 0.000001) {
      alert("Please enter an amount with at most two decimal places.");
      return;
    }

    setSaving(true);

    try {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("You must be logged in.");
      }

      const { error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type,
          amount: value,
          description: description.trim(),
          date,
        });

      if (error) throw error;

      try {
        await onSaved();
      } catch (refreshError) {
        console.error("Transaction saved, but refresh failed:", refreshError);
        alert("Transaction saved, but the list could not refresh.");
      }

      onClose();

    } catch (error) {
      console.error("Error saving transaction:", error.message);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="presentation"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-transaction-title"
        className="
          bg-[#242132] text-white
          p-5 sm:p-8 rounded-2xl
          w-full max-w-[450px]
          max-h-[90vh] overflow-y-auto
          shadow-2xl
        "
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}>

        <div className="flex justify-between items-center mb-6">
          <h1
            id="add-transaction-title"
            className="text-xl font-bold">
            Add Transaction
          </h1>

          <motion.button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close transaction form"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.15 }}
            className="bg-white/10 text-white rounded-2xl px-3.5 py-2 disabled:opacity-50">
            ✕
          </motion.button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-2">
            <motion.button
              type="button"
              disabled={saving}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setType("expense")}
              className={`rounded-xl py-2.5 transition-colors ${
                type === "expense"
                  ? "bg-white/80 text-black"
                  : "bg-white/10 text-white"
              }`}>
              Expense
            </motion.button>

            <motion.button
              type="button"
              disabled={saving}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setType("income")}
              className={`rounded-xl py-2.5 transition-colors ${
                type === "income"
                  ? "bg-white/80 text-black"
                  : "bg-white/10 text-white"
              }`}>
              Income
            </motion.button>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="transaction-amount" className="text-sm text-white/70">
              Amount ($)
            </label>

            <input
              id="transaction-amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="
                w-full bg-white/10
                border border-white/10
                rounded-xl px-4 py-3
                text-sm font-[inherit]
                text-white
                placeholder:text-white/40
                scheme-dark
                outline-none
                focus:border-white/40
                transition-colors
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none"/>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="transaction-description" className="text-sm text-white/70">
              Description (optional)
            </label>

            <input
              id="transaction-description"
              type="text"
              placeholder="e.g. Groceries at Walmart"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="
                w-full bg-white/10
                border border-white/10
                rounded-xl px-4 py-3
                text-sm font-[inherit]
                text-white
                placeholder:text-white/40
                scheme-dark
                outline-none
                focus:border-white/40
                transition-colors"/>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="transaction-date" className="text-sm text-white/70">
              Date
            </label>

            <input
              id="transaction-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="
                w-full bg-white/10
                border border-white/10
                rounded-xl px-4 py-3
                text-sm font-[inherit]
                text-white/70
                scheme-dark
                outline-none
                focus:border-white/40
                transition-colors"/>
          </div>

          <motion.button
            type="submit"
            disabled={saving}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: saving ? 1 : 1.03 }}
            className="
              bg-white text-black
              rounded-xl py-3 mt-2
              font-medium
              hover:bg-white/80
              transition-colors
              disabled:opacity-50
              disabled:cursor-not-allowed">
            {saving ? "Saving..." : "Save Transaction"}
          </motion.button>

        </form>
      </motion.div>
    </motion.div>
  );
}

function Transactions() {
  const [showAdd, setShowAdd] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionError, setTransactionError] = useState(null);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error.message);
      setTransactionError("Unable to load transactions.");
      throw error;
    }

    setTransactions(data ?? []);
    setTransactionError(null);
  };

  useEffect(() => {
    let active = true;

    const loadTransactions = async () => {
      try {
        await fetchTransactions();
      } catch (error) {
        console.error("Failed to load transactions:", error.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTransactions();

    return () => {
      active = false;
    };
  }, []);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const monthlyTransactions = transactions.filter((transaction) => {
    const [year, month] = transaction.date.split("-").map(Number);

    return year === currentYear && month === currentMonth;
  });

  const income = monthlyTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expenses = monthlyTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const cashFlow = income - expenses;

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(value);

  const displayMoney = (value) => {
    if (loading) return "...";
    if (transactionError) return "Unavailable";
    return formatMoney(value);
  };

  return (
    <div className="bg-[#080616] min-h-screen text-white pt-3 flex flex-col">

      <Header />

      <main
        className="
          w-[95%] sm:w-[90%] lg:w-[85%]
          max-w-[1200px] mx-auto
          flex-1 flex flex-col
          py-8 gap-6">

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Transactions!
            </h1>

            <p className="text-base sm:text-lg text-white/60">
              Manage your income and expenses.
            </p>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowAdd(true)}
            className="
              self-start shrink-0
              hover:bg-white/80
              text-sm bg-white/85 text-black
              rounded-2xl px-4 py-3
              sm:mt-6
              transition-colors">
            Add Transaction
          </motion.button>
        </div>

        {transactionError && (
          <p className="text-red-400 text-sm" role="alert">
            {transactionError}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="flex flex-col justify-between bg-white/10 border border-white/10 rounded-2xl p-6 h-[200px]">
            <h2 className="text-white/60 text-sm">
              Income
            </h2>

            <h1 className="text-2xl lg:text-3xl font-bold text-green-400/80 break-words">
              {displayMoney(income)}
            </h1>

            <h2 className="text-white/60 text-xs">
              This Month
            </h2>
          </div>

          <div className="flex flex-col justify-between bg-white/10 border border-white/10 rounded-2xl p-6 h-[200px]">
            <h2 className="text-white/60 text-sm">
              Expenses
            </h2>

            <h1 className="text-2xl lg:text-3xl font-bold text-red-400/80 break-words">
              {displayMoney(expenses)}
            </h1>

            <h2 className="text-white/60 text-xs">
              This Month
            </h2>
          </div>

          <div className="flex flex-col justify-between bg-white/10 border border-white/10 rounded-2xl p-6 h-[200px]">
            <h2 className="text-white/60 text-sm">
              Cash Flow
            </h2>

            <h1
              className={`text-2xl lg:text-3xl font-bold break-words ${
                cashFlow >= 0
                  ? "text-green-400/80"
                  : "text-red-400/80"
              }`}>
              {loading || transactionError
                ? displayMoney(cashFlow)
                : `${cashFlow < 0 ? "-" : "+"}${formatMoney(Math.abs(cashFlow))}`}
            </h1>

            <h2 className="text-white/60 text-xs">
              This Month
            </h2>
          </div>

        </div>

        <div className="bg-white/10 border border-white/10 rounded-2xl p-6">

          <h2 className="text-white/60 text-sm mb-6">
            Transaction History
          </h2>

          <div
            className="
              max-h-[180px] overflow-y-auto pr-4
              [scrollbar-width:thin]
              [scrollbar-color:#595568_transparent]">

            {loading ? (
              <p className="text-white/40 text-sm">
                Loading transactions...
              </p>
            ) : transactionError ? (
              <p className="text-red-400/70 text-sm">
                Transactions unavailable.
              </p>
            ) : transactions.length === 0 ? (
              <p className="text-white/40 text-sm">
                No transactions yet.
              </p>
            ) : (
              <div className="flex flex-col">

                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="
                      grid grid-cols-[minmax(0,1fr)_auto]
                      items-center gap-4 sm:gap-6
                      border-b border-white/10
                      py-4 px-3
                      hover:bg-white/5
                      transition-colors rounded-lg">

                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {transaction.description || "Transaction"}
                      </p>

                      <p className="text-white/40 text-xs">
                        {transaction.date}
                      </p>
                    </div>

                    <p
                      className={`text-sm font-semibold text-right whitespace-nowrap ${
                        transaction.type === "income"
                          ? "text-green-400/80"
                          : "text-red-400/80"
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

      <AnimatePresence>
        {showAdd && (
          <Add
            onClose={() => setShowAdd(false)}
            onSaved={fetchTransactions}/>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Transactions;
