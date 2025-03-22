import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jsonString: string) => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [jsonInput, setJsonInput] = useState<string>('{"if": [{">":[{"var":"age"}, 18]}, "Adult", "Minor"]}');
  const { toast } = useToast();

  const handleImport = () => {
    try {
      // Validate JSON
      JSON.parse(jsonInput);
      onImport(jsonInput);
      toast({
        title: "JSON imported successfully",
        description: "Your JSON Logic has been imported.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import JSON Logic</DialogTitle>
          <DialogDescription>
            Paste your JSON Logic code below to import it into the builder.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="h-40 font-mono text-sm"
            placeholder='{"if": [{">":[{"var":"age"}, 18]}, "Adult", "Minor"]}'
          />
        </div>
        
        <div className="text-sm text-neutral-500 mb-4">
          <p>The imported JSON will replace your current workspace content.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
