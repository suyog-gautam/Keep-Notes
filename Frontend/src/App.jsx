import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import { Error } from "./pages/Error";
import { AddNote } from "./pages/AddNote";
import { SingleNote } from "./pages/SIngleNote";
import "./App.css";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addnote" element={<AddNote />} />
          <Route path="/singlenote/:noteId" element={<SingleNote />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
