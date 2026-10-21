import { Routes, Route } from "react-router-dom";
import SignUp from "./signup";
import Login from "./login";
import Dashboard from "./dashboard";
import Transactions from "./transactions";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <Routes>

      <Route path="/" element={<SignUp />} />

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
      </Route>

    </Routes>
  );
}

export default App;