import { Twitter, Linkedin, Github, XIcon } from "lucide-react";

import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className=" flex flex-col md:flex-row items-center justify-between gap-4 p-6 md:h-20">
        <div className="text-lg font-medium cursor-pointer">
          <Link to="/">Keep Notes</Link>
        </div>
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1 ">
            Designed By
            <span className="text-black font-semibold"> Suyog </span>
          </div>
          <div>
            <span className="text-black font-semibold">&copy;</span> Copy Right
            2024 All Right Reserved
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">Find My Socials</span>
          <div className="flex gap-4">
            <Link
              to="https://github.com/suyog-gautam/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-black"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">Github</span>
            </Link>
            <Link
              to="https://www.linkedin.com/in/suyog-gautam/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-black"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">Linkdin</span>
            </Link>
            <Link
              to="https://x.com/hey_suyog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-black"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
