'use client'; // این فایل حتماً باید کلاینت کامپوننت باشه

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // چاپ ارور در کنسول مرورگر
    console.error("Next.js Error Boundary Caught:", error);
  }, [error]);

  return (
    <div dir="ltr" style={{ padding: '2rem', margin: '2rem', backgroundColor: '#fee2e2', borderRadius: '1rem', border: '2px solid #ef4444' }}>
      <h2 style={{ color: '#b91c1c', fontSize: '1.5rem', fontWeight: 'bold' }}>🚨 Error Boundary Caught a Crash!</h2>
      
      <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Error Message:</p>
      <pre style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', color: '#dc2626', whiteSpace: 'pre-wrap' }}>
        {error.message}
      </pre>

      <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Stack Trace:</p>
      <pre style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.875rem', overflowX: 'auto' }}>
        {error.stack}
      </pre>

      <button
        onClick={() => reset()}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '0.5rem' }}
      >
        تلاش مجدد
      </button>
    </div>
  );
}