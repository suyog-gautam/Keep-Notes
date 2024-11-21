import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
const notes = [
  {
    id: 1,
    title: "Note 1",
    subtitle: "Website Design",
    content:
      "Note for the testing. This is note number one and I'm making more notes today or next week so please subscribe me.",
    date: "2/4/2024",
    isImportant: true,
  },
  {
    id: 2,
    title: "Note 2",
    subtitle: "App Development",
    content:
      "This is a normal note about app development that has some useful tips and practices.",
    date: "3/5/2024",
    isImportant: false,
  },
  {
    id: 3,
    title: "Note 3",
    subtitle: "Machine Learning",
    content:
      "This is a very long content to demonstrate the show more functionality. The note content will exceed the word count to test the show more button in the application. Stay tuned for more updates.",
    date: "4/6/2024",
    isImportant: false,
  },
  {
    id: 4,
    title: "Note 4",
    subtitle: "Cybersecurity Tips",
    content:
      "This is an important note about cybersecurity. Make sure to follow these best practices to secure your systems.",
    date: "5/7/2024",
    isImportant: true,
  },
];

export function Profile() {
  // Utility function for trimming normal notes
  const forNormal = (content, wordLimit = 27) => {
    const words = content.split(" ");
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Utility function for trimming important notes
  const forImportant = (content, wordLimit = 32) => {
    const words = content.split(" ");
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Filter notes based on importance
  const importantNotes = notes.filter((note) => note.isImportant);
  const normalNotes = notes.filter((note) => !note.isImportant);

  return (
    <>
      <Navbar />
      <div className="py-8 px-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg" alt="Profile Picture" />
            <AvatarFallback>SG</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center md:items-start gap-4 flex-1">
            <div className="space-y-1 text-center md:text-left">
              <h1 className="text-2xl font-semibold">Suyog</h1>
              <p className="text-sm text-muted-foreground">
                Joined on 2/3/2023
              </p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Total Notes: {notes.length}</span>
              <span>Important Notes: {importantNotes.length}</span>
            </div>
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold">
            Your <span className="text-blue-500">Important</span> Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {importantNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {note.title}
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 text-white"
                    >
                      Important
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{note.subtitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {forImportant(note.content)}
                    {note.content.split(" ").length > 32 && (
                      <Link to="/">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal text-black text-sm"
                        >
                          Show more
                        </Button>
                      </Link>
                    )}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {note.date}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Normal Notes Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Your <span className="text-blue-500">Normal</span> Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {normalNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {note.title}
                  </div>
                  <CardTitle className="text-lg">{note.subtitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {forNormal(note.content)}
                    {note.content.split(" ").length > 27 && (
                      <Link to="/">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal text-black text-sm"
                        >
                          Show more
                        </Button>
                      </Link>
                    )}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {note.date}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
