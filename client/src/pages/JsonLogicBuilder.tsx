import { useState } from "react";
import Header from "@/components/Header";
import OperationsPanel from "@/components/OperationsPanel";
import BuilderWorkspace from "@/components/BuilderWorkspace";
import JsonPreview from "@/components/JsonPreview";
import ImportModal from "@/components/ImportModal";
import { useJsonLogicBuilder } from "@/lib/useJsonLogicBuilder";

export default function JsonLogicBuilder() {
  const {
    jsonLogic,
    jsonLogicString,
    setJsonLogic,
    addOperation,
    updateOperation,
    removeOperation,
    clearAll,
    testLogic,
    validateLogic
  } = useJsonLogicBuilder();
  
  // Function to create a complex example with nested operations
  const createComplexExample = () => {
    // Create a complex example with nested operations including the custom "length" operation
    // This builds a logic that checks if the length of value in variable "number" is equal to 
    // the result of addition(max([data.threshold]), multiply(5, 2))
    const exampleLogic = {
      "==": [
        { "length": [{ "var": "number" }] },
        { "+": [
            { "max": [{ "var": "threshold" }] },
            { "*": [5, 2] }
          ]
        }
      ]
    };
    
    // Update the JSON logic
    setJsonLogic(exampleLogic);
    
    // Set test data that includes both variables
    setTestData(JSON.stringify({
      "number": 12345,
      "threshold": 3
    }, null, 2));
  };

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [testData, setTestData] = useState<string>('{"age": 25, "name": "John"}');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleImport = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setJsonLogic(parsed);
      setIsImportModalOpen(false);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  const handleTest = () => {
    try {
      const result = testLogic(JSON.parse(testData));
      setTestResult(JSON.stringify(result));
    } catch (error) {
      setTestResult("Error: Invalid data");
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonLogicString);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onImport={() => setIsImportModalOpen(true)} 
        onCopyJson={handleCopyJson}
        onCreateExample={createComplexExample}
      />
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <OperationsPanel onAddOperation={addOperation} />
        
        <BuilderWorkspace 
          jsonLogic={jsonLogic} 
          onUpdateOperation={updateOperation}
          onRemoveOperation={removeOperation}
          onClearAll={clearAll}
          onValidate={validateLogic}
        />
        
        <JsonPreview 
          jsonLogicString={jsonLogicString} 
          testData={testData}
          onTestDataChange={setTestData}
          testResult={testResult}
          onTest={handleTest}
        />
      </main>

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImport} 
      />
    </div>
  );
}
