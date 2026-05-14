import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JanSeva />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;