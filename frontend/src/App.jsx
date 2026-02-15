import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { UserProvider,useUser } from "./context/userContext";
import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation.jsx";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget.jsx";
export default function App() {
  function PrivateRoute({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" replace />;
}
// function PublicRoute({children}){
//   const {user} = useUser();
//   if(!user) return children;
// }
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute> <Navigation/><Dashboard/></PrivateRoute>}/>
          <Route path="/expenses" element={<PrivateRoute> <Navigation/><Expenses/></PrivateRoute>}/>
          <Route path="/budget" element={<PrivateRoute> <Navigation/><Budget/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
