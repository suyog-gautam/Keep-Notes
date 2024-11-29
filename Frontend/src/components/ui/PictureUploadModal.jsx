import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function PictureUploadModal({
  isOpen,
  onClose,
  currentPicture,
  onUpload,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentPicture);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPreview(currentPicture);
    setSelectedFile(null);
  }, [currentPicture, isOpen]);

  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("profilePic", selectedFile);
    const userId = localStorage.getItem("userId");
    formData.append("userId", userId);

    try {
      const response = await fetch("http://localhost:8000/user/profile-pic", {
        method: "POST",
        body: formData,
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Received non-JSON response:", text);
        throw new Error("Server error. Please try again.");
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.user && data.user.profilePic) {
        const profilePicUrl = `http://localhost:8000/${data.user.profilePic}`;
        onUpload(profilePicUrl);
        onClose();
        toast.success("Profile picture updated successfully.");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      toast.error(
        err.message || "Failed to upload profile picture. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Avatar className="h-40 w-40">
              {preview ? (
                <AvatarImage
                  src={preview}
                  alt="Profile picture preview"
                  className="object-cover"
                />
              ) : (
                <AvatarFallback>
                  <Upload
                    className="w-10 h-10 text-gray-400"
                    aria-hidden="true"
                  />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="picture"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
              aria-label="Select profile picture"
            />
            <label
              htmlFor="picture"
              className="cursor-pointer flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
            >
              Select Image
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2"
            size="sm"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            size="sm"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Uploading..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
