import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Note } from "@/components/Note";
import { NoNotes } from "./NoNotes";
import { SearchInput } from "@/components/ui/SearchInput";
import { Footer } from "@/components/Footer";
export const Home = () => {
  const [notesExist, setNotesExist] = useState(true);
  const [notes, setNotes] = useState([]);
  const [userDetails, setUserDetailes] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchNotes = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        setNotesExist(false); // No notes to display
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/getNotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();

        if (data.success) {
          setNotes(data.data);
          setNotesExist(data.data.length > 0); // Update Home component's state
        } else {
          setError(data.message || "No notes found");
          setNotesExist(false); // No notes to display
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to fetch notes");
        setNotesExist(false); // Error occurred, no notes available
      }
    };

    fetchNotes();
  }, [setNotesExist]);
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");

        return;
      }

      try {
        const response = await fetch("http://localhost:8000/getUserDetails", {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();

        if (data.success) {
          setUserDetailes(data.data);
        } else {
          setError(data.message || "No notes found");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user info");
      }
    };

    fetchUserDetails();
  }, []);
  return (
    <>
      <div style={{ minHeight: "90vh" }}>
        <Navbar />
        {notesExist ? (
          <div className="home-container p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium">Hi, {userDetails?.name}</h1>
              <div className="w-full max-w-sm">
                <SearchInput />
              </div>
            </div>
          </div>
        ) : null}
        {/* Pass setNotesExist as a prop to Note */}
        {notesExist ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map((note, index) => (
              <Note key={index} note={note} />
            ))}
          </div>
        ) : (
          <NoNotes />
        )}
      </div>
      <Footer />
    </>
  );
};
