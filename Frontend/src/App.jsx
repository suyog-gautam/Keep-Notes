import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import { Error } from "./pages/Error";
import { AddNote } from "./pages/AddNote";
import { SingleNote } from "./pages/SingleNote";
import { Search } from "./pages/Search";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RedirectWithToast } from "./components/RedirectWithToast";
import { PasswordReset } from "./pages/PasswordReset";
import { EditNote } from "./pages/EditNote";
import "./App.css";

function App() {
  const [validUser, setValidUser] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // To avoid rendering before the check is complete
  const userId = localStorage.getItem("userId");

  const validateUser = async () => {
    if (userId) {
      try {
        const response = await fetch("http://localhost:8000/getUserDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        if (data.success) {
          setValidUser(true);
        } else {
          setValidUser(false);
        }
      } catch (error) {
        console.error("Error validating user:", error);
        setValidUser(false);
      }
    } else {
      setValidUser(false);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    validateUser();
  }, []);

  if (isChecking) {
    return <div>Loading...</div>; // Show a loader while checking user validity
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              !validUser ? (
                <Login />
              ) : (
                <RedirectWithToast
                  to="/"
                  message="You are already logged in!"
                />
              )
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              !validUser ? (
                <PasswordReset />
              ) : (
                <RedirectWithToast
                  to="/"
                  message="You are already logged in!"
                />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !validUser ? (
                <SignUp />
              ) : (
                <RedirectWithToast
                  to="/"
                  message="You are already logged in!"
                />
              )
            }
          />
          <Route path="*" element={<Error />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute isValid={validUser} />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addnote" element={<AddNote />} />
            <Route path="/singlenote/:noteId" element={<SingleNote />} />
            <Route path="/editnote/:noteId" element={<EditNote />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
