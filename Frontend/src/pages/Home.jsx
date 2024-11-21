import React from "react";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Note } from "@/components/Note";
import { NoNotes } from "./NoNotes";
import { SearchInput } from "@/components/ui/SearchInput";
import { Footer } from "@/components/Footer";
export const Home = () => {
  const [notesExist, setNotesExist] = React.useState(true); // Track if notes exist

  return (
    <>
      <div style={{ minHeight: "90vh" }}>
        <Navbar />
        {notesExist ? (
          <div className="home-container p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium">Hi, Suyog</h1>
              <div className="w-full max-w-sm">
                <Input
                  type="search"
                  placeholder="Search Notes"
                  className="bg-muted/50"
                />
              </div>
            </div>
          </div>
        ) : null}
        {/* Pass setNotesExist as a prop to Note */}
        {notesExist ? <Note setNotesExist={setNotesExist} /> : <NoNotes />}
      </div>
      <Footer />
    </>
  );
};
