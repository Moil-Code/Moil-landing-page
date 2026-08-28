"use client";

import { Suspense } from 'react';
import SearchJobField from '../../../src/candidate/sections/search_field';

function SearchJobFieldContent() {
  return <SearchJobField accType="client" />;
}

export default function SearchJobFieldPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchJobFieldContent />
    </Suspense>
  );
}
