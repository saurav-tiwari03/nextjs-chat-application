"use client"

import React, { useState, useEffect } from "react";
import { sendGetRequest } from "@/utils/SendRequest";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search } from "lucide-react";

export default function SearchUser({ onSelectUser }: { onSelectUser?: (user: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const data = await sendGetRequest(`/search?search=${query}`);
          setResults(data || []);
        } catch (err) {
          console.error("Error fetching users:", err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchData();
    }, 400);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <Card className="h-full border border-white/10 bg-zinc-900 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Users className="h-5 w-5" /> Search Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for users..."
            className="pl-9 border-white/10 bg-black/50 text-white placeholder:text-zinc-500"
          />
        </div>

        {loading && <p className="text-sm text-zinc-400">Searching...</p>}

        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            results.map((user: any) => (
              <li
                key={user.id}
                className="cursor-pointer rounded-md border border-white/10 bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
                onClick={() => onSelectUser?.(user.name)}
              >
                {user.name}
              </li>
            ))
          ) : (
            !loading &&
            query && <p className="text-sm text-zinc-500">No users found.</p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
