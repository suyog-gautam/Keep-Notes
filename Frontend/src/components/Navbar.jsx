import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Logout } from "./Logout";

export function Navbar() {
  const [userDetails, setUserDetailes] = useState();
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
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <header className="sticky top-0 p-6 z-50 cursor-pointer w-full bg-[#f7f7f7] border-b bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/60 ">
      <div className=" flex h-5 items-center justify-between">
        <Link className="flex items-center space-x-2" to="/">
          <span className="text-xl font-medium">Keep Notes</span>
        </Link>
        <div className=" flex items-center space-x-4">
          <Link to="/addnote">
            <Button className="bg-[#578df5] hover:bg-[#4b7cd0] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8 ">
                  <AvatarImage
                    src={`http://localhost:8000/${userDetails?.profilePic}`}
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-slate-300">
                    {userDetails?.name
                      ? userDetails?.name.slice(0, 2).toUpperCase()
                      : "NA"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userDetails?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/addnote">New Note</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <Logout />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
