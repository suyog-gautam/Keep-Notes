import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Note } from "@/components/Note";
import { Button } from "@/components/ui/button";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PictureUploadModal } from "@/components/ui/PictureUploadModal";

export function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [notes, setNotes] = useState([]);
  const [importantNotes, setImportantNotes] = useState([]);
  const [normalNotes, setNormalNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
    fetchNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      const important = notes.filter((note) => note.isImportant);
      const normal = notes.filter((note) => !note.isImportant);
      setImportantNotes(important);
      setNormalNotes(normal);
    }
  }, [notes]);

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
        setUserDetails(data.data);
      } else {
        setError(data.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user info");
    }
  };

  const fetchNotes = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch("http://localhost:8000/getNotes", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();

      if (data.success) {
        setNotes(data.data);
      } else {
        setError(data.message || "No notes found");
      }
    } catch (err) {
      console.error("Error fetching user notes:", err);
      setError("Failed to fetch notes");
    }
  };
  console.log(userDetails?.profilePic);
  return (
    <>
      <Navbar />
      <div className="py-8 px-6 " style={{ minHeight: "83vh" }}>
        {/* Profile Header */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8">
          <Avatar className="h-24 w-24">
            {userDetails?.profilePic ? (
              <AvatarImage
                src={`http://localhost:8000/${userDetails.profilePic}`}
                alt="Profile Picture"
                className="object-cover"
              />
            ) : (
              <AvatarFallback>
                {userDetails?.name
                  ? userDetails.name.slice(0, 2).toUpperCase()
                  : "NA"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col items-center md:items-start gap-4 flex-1">
            <div className="space-y-1 text-center md:text-left">
              <h1 className="text-2xl font-semibold">{userDetails?.name}</h1>
              <p className="text-sm text-muted-foreground">
                Joined on{" "}
                {userDetails?.date
                  ? new Date(userDetails.date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>
                Total Notes : {importantNotes.length + normalNotes.length}
              </span>
              <span>Important Notes : {importantNotes.length}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
              <Upload className="h-4 w-4" />
              Add Picture
            </Button>
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold">
            Your <span className="text-blue-500">Important</span> Notes
          </h2>
          {importantNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {importantNotes.map((note, index) => (
                <Note key={index} note={note} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You don't have any important notes.</p>
          )}
        </div>

        {/* Normal Notes Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Your <span className="text-blue-500">Normal</span> Notes
          </h2>
          {normalNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {normalNotes.map((note, index) => (
                <Note key={index} note={note} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You don't have any normal notes.</p>
          )}
        </div>
      </div>
      <PictureUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPicture={userDetails?.profilePic}
        onUpload={(url) => console.log(url)}
      />
      <Footer />
    </>
  );
}
