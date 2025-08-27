import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryTable from './components/InventoryTable';
import { useTestResults, useUpdateTestStatus, TestResult } from './hooks/useTestResults';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SampleForm } from './components/SampleForm';
import { StatusBadge } from './components/StatusBadge';

const queryClient = new QueryClient();

const TestResultsTest: React.FC = () => {
  const { data: testResults, isLoading, error, refetch } = useTestResults();
  const updateMutation = useUpdateTestStatus();

  const handleStatusUpdate = (id: string, newStatus: TestResult['status']) => {
    updateMutation.mutate({ id, status: newStatus });
  };

  if (isLoading) return <div>Loading test results...</div>;
  if (error)
    return (
      <div>
        Error: {(error as Error).message}{' '}
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );

  return (
    <div style={{ border: '2px solid green', padding: '20px', margin: '20px' }}>
      <h2>TanStack Query Test Results</h2>
      {testResults?.map((result) => (
        <div
          key={result.id}
          style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}
        >
          <h3>{result.displayName}</h3>
          <p>
            Status: <strong>{result.status}</strong>
          </p>
          <div>
            <button onClick={() => handleStatusUpdate(result.id, 'pending')}>Pending</button>
            <button onClick={() => handleStatusUpdate(result.id, 'in-progress')}>In Progress</button>
            <button onClick={() => handleStatusUpdate(result.id, 'completed')}>Completed</button>
            <button onClick={() => handleStatusUpdate(result.id, 'failed')}>Failed</button>
          </div>
          {updateMutation.isPending && <p>Updating...</p>}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Vibrant LMS — Assessment Starter</h1>
      <p className="text-sm text-gray-600">Open <code>ASSESSMENT.md</code> for full instructions. Implement the tasks below.</p>

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-medium">1) Inventory Table</h2>
        <InventoryTable />
      </section>

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-medium">2) TanStack Query Hooks</h2>
        <TestResultsTest />
      </section>

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-medium">3) Maintenance API</h2>
        <p className="text-sm text-gray-600">Fill in <code>api/src/routes/maintenance.js</code> with JWT auth, validation, pagination, and proper error responses.</p>
      </section>

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-medium">4) Sample Form</h2>
        <p className="text-sm text-gray-600">Build <code>SampleForm</code> in <code>src/components/SampleForm.tsx</code> with client/server validation parity.</p>
        <SampleForm />
      </section>

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-medium">5) Status Badge</h2>
        <div className="space-y-2">
        <p className="text-sm text-gray-600">Status badge examples:</p>
        <div className="flex gap-2">
      <StatusBadge status="pending" />
      <StatusBadge status="in-progress" />
      <StatusBadge status="completed" />
      <StatusBadge status="failed" />
          </div>
        </div>
      </section>
    </div>
    </Router>
    </QueryClientProvider>
  )
}
