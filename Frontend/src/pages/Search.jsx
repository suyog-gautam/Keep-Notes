import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Note } from "@/components/Note";
import { NoSearch } from "./NoSearch";
import { useLocation } from "react-router-dom";
import { SearchInput } from "@/components/ui/SearchInput";
import { Footer } from "@/components/Footer";

export const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";

  const [allNotes, setAllNotes] = useState([]); // Stores all fetched notes
  const [filteredNotes, setFilteredNotes] = useState([]); // Stores filtered notes based on query
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
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
          setAllNotes(data.data); // Store all notes in state
        } else {
          setError(data.message || "No notes found");
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to fetch notes");
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    // Filter notes based on the query
    if (query) {
      const filtered = allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.description.toLowerCase().includes(query)
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(allNotes); // If no query, show all notes
    }
  }, [query, allNotes]);

  return (
    <>
      <div style={{ minHeight: "90vh" }}>
        <Navbar />
        <div className="home-container p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-medium">Hi, Suyog</h1>
            <div className="w-full max-w-sm">
              <SearchInput />
            </div>
          </div>
        </div>

        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note, index) => (
              <Note key={index} note={note} />
            ))}
          </div>
        ) : (
          <NoSearch query={query} />
        )}
      </div>

      <Footer />
    </>
  );
};
