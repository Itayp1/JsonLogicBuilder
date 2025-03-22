import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface JsonPreviewProps {
  jsonLogicString: string;
  testData: string;
  onTestDataChange: (value: string) => void;
  testResult: string | null;
  onTest: () => void;
}

export default function JsonPreview({
  jsonLogicString,
  testData,
  onTestDataChange,
  testResult,
  onTest
}: JsonPreviewProps) {
  const [isFormatted, setIsFormatted] = useState(true);

  // Toggle between formatted and minified JSON
  const toggleFormat = () => {
    setIsFormatted(!isFormatted);
  };

  const formatJson = (json: string): string => {
    try {
      return isFormatted 
        ? JSON.stringify(JSON.parse(json), null, 2) 
        : JSON.stringify(JSON.parse(json));
    } catch (e) {
      return json || "{}";
    }
  };

  // Apply syntax highlighting to JSON
  const syntaxHighlight = (json: string) => {
    // Replace with regex for JSON syntax highlighting
    return json
      .replace(/"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?/g, (match) => {
        const cls = match.endsWith(':') ? 'json-key' : 'json-string';
        return `<span class="${cls}">${match}</span>`;
      })
      .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
      .replace(/\b(null)\b/g, '<span class="json-null">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="json-number">$1</span>');
  };

  return (
    <aside className="w-full md:w-96 bg-white border-l border-neutral-200 flex flex-col">
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="font-semibold text-neutral-800">JSON Preview</h2>
        <div>
          <Button variant="outline" size="sm" onClick={toggleFormat}>
            {isFormatted ? "Minify JSON" : "Format JSON"}
          </Button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4">
        <pre 
          className="bg-neutral-800 text-neutral-100 p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ 
            __html: syntaxHighlight(formatJson(jsonLogicString))
          }}
        ></pre>
      </div>
      
      <div className="p-4 border-t border-neutral-200 bg-neutral-50">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-neutral-600 mb-2">Test Data</h3>
          <Textarea
            value={testData}
            onChange={(e) => onTestDataChange(e.target.value)}
            placeholder='{"age": 25, "name": "John"}'
            className="w-full h-20 p-2 font-mono text-sm"
          />
        </div>
        <div className="mb-3">
          <h3 className="text-sm font-medium text-neutral-600 mb-2">Result</h3>
          <div className="bg-white border border-neutral-300 rounded p-2 text-sm font-mono min-h-10">
            {testResult || "Run test to see result"}
          </div>
        </div>
        <Button className="w-full" onClick={onTest}>
          Test Logic
        </Button>
      </div>
    </aside>
  );
}
