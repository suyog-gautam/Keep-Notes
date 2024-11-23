"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Hook to handle navigation

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-sm">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder="Search Notes"
          className="bg-muted/50 pl-8 pr-8"
          value={searchQuery}
          onChange={handleInputChange}
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-[#e1dfdf]"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4 " />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      <Button
        type="submit"
        className="ml-2 bg-accent text-white hover:bg-[#286bdd]"
      >
        Search
      </Button>
    </form>
  );
}
