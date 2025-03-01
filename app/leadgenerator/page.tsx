'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface InstagramUser {
  username: string;
  full_name: string;
  is_private: boolean;
  is_verified: boolean;
  profile_pic_url: string;
  pk: number;
}

const ProxyImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setError(false);
  }, [src]);

  if (error) {
    return (
      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
        <span className="text-zinc-600 text-xs">No Image</span>
      </div>
    );
  }

  return (
    <img 
      src={`/api/proxy?url=${encodeURIComponent(imageSrc)}`}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => {
        if (!error) {
          setError(true);
        }
      }}
    />
  );
};

export default function LeadGenerator() {
  const [searchResults, setSearchResults] = useState<InstagramUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const searchProfiles = async () => {
    setLoading(true);
    setError('');
    
    try {
      const url = `https://instagram-realtimeapi.p.rapidapi.com/instagram/search/users?query=${searchQuery}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '52655f1cfbmshc28794a26461c71p1a3967jsnc854ec10622d',
          'X-RapidAPI-Host': 'instagram-realtimeapi.p.rapidapi.com'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.users && data.users.length > 0) {
        setSearchResults(data.users);
      } else {
        setError('No results found');
      }
    } catch (err) {
      setError('Failed to fetch profiles: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!searchResults.length) return;

    const worksheet = XLSX.utils.json_to_sheet(
      searchResults.map(user => ({
        Username: user.username,
        'Full Name': user.full_name,
        'Is Private': user.is_private ? 'Yes' : 'No',
        'Is Verified': user.is_verified ? 'Yes' : 'No',
        'Profile URL': `https://instagram.com/${user.username}`
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Instagram Users');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `instagram_users_${searchQuery}.xlsx`);
  };

  const filteredResults = filterVerified 
    ? searchResults.filter(user => user.is_verified)
    : searchResults;

  // Calculate pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-slate-50">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-slate-50">Instagram Account Search</h1>
        
        <div className="flex gap-4 mb-6">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a Keyword, e.g. 'fashion designer in New York'"
            className="flex-1 bg-zinc-800 border-zinc-700 text-slate-50 placeholder:text-slate-400"
            onKeyPress={(e) => e.key === 'Enter' && searchProfiles()}
          />
          <Button 
            onClick={searchProfiles} 
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {error && (
          <div className="text-red-400 mb-4 p-3 bg-red-900/20 rounded-md">{error}</div>
        )}

        {searchResults.length > 0 && (
          <>
            <div className="mb-4 flex gap-4 items-center">
              <Button 
                onClick={exportToExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Export to Excel
              </Button>
              <label className="flex items-center gap-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800"
                />
                Show only verified users
              </label>
              <span className="ml-auto text-slate-400">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredResults.length)} of {filteredResults.length} results
              </span>
            </div>

            <div className="rounded-lg border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-800 bg-zinc-800/50">
                    <TableHead className="text-slate-200">Profile Picture</TableHead>
                    <TableHead className="text-slate-200">Username</TableHead>
                    <TableHead className="text-slate-200">Instagram URL</TableHead>
                    <TableHead className="text-slate-200">Full Name</TableHead>
                    <TableHead className="text-slate-200">Verified</TableHead>
                    <TableHead className="text-slate-200">Private</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentResults.map((user) => (
                    <TableRow 
                      key={user.pk}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                    >
                      <TableCell className="text-slate-300">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
                          <ProxyImage 
                            src={user.profile_pic_url} 
                            alt={user.username}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300 font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <a 
                          href={`https://instagram.com/${user.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-400 hover:text-pink-300 transition-colors hover:underline flex items-center gap-1"
                        >
                          instagram.com/{user.username}
                          <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                            />
                          </svg>
                        </a>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {user.full_name}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {user.is_verified ? 
                          <span className="text-emerald-400">✓</span> : 
                          <span className="text-slate-500">✗</span>
                        }
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {user.is_private ? 
                          <span className="text-amber-400">✓</span> : 
                          <span className="text-slate-500">✗</span>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    className={`w-10 ${
                      currentPage === pageNumber 
                        ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                        : 'border-zinc-700 text-slate-200 hover:bg-zinc-800'
                    }`}
                  >
                    {pageNumber}
                  </Button>
                ))}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 