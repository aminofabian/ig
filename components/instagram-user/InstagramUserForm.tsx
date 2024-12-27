'use client';

import { useState, FormEvent } from 'react';

interface Props {
  onSubmit: (username: string) => void;
  loading: boolean;
}

export default function InstagramUserForm({ onSubmit, loading }: Props) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(username);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter Instagram username"
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        disabled={loading || !username}
        className="bg-[#f059da] text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {loading ? 'Loading...' : 'Fetch Details'}
      </button>
    </form>
  );
}
