
import React from 'react';
import LogicNode from './components/LogicNode';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Logic Builder</h1>
        <LogicNode />
      </div>
    </QueryClientProvider>
  );
}

export default App;
