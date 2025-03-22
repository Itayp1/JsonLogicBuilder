import { Button } from "@/components/ui/button";
import { Clipboard, FolderOpen, BookOpen } from "lucide-react";

interface HeaderProps {
  onImport: () => void;
  onCopyJson: () => void;
  onCreateExample?: () => void;
}

export default function Header({ onImport, onCopyJson, onCreateExample }: HeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <i className="ri-code-box-line text-primary text-2xl"></i>
            <h1 className="text-xl font-semibold">JSONLogic Builder</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {onCreateExample && (
            <Button variant="outline" onClick={onCreateExample}>
              <BookOpen className="h-4 w-4 mr-2" />
              Create Example
            </Button>
          )}
          <Button variant="outline" onClick={onImport}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={onCopyJson}>
            <Clipboard className="h-4 w-4 mr-2" />
            Copy JSON
          </Button>
        </div>
      </div>
    </header>
  );
}
