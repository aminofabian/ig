'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from "sonner";

interface Business {
  name: string;
  phone_number: string;
  full_address: string;
  website: string;
  rating: number;
  review_count: number;
  business_status: string;
  type: string;
  owner_name?: string;
  email?: string;
}

export default function BusinessSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search-businesses?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      setBusinesses(data.data || []);
      if (data.data.length === 0) {
        toast.info('No businesses found');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (businesses.length === 0) {
      toast.error('No data to download');
      return;
    }

    const headers = [
      'Name',
      'Phone',
      'Address',
      'Website',
      'Rating',
      'Reviews',
      'Status',
      'Type',
      'Owner Name',
      'Email'
    ];
    const csvData = businesses.map(b => [
      b.name,
      b.phone_number,
      b.full_address,
      b.website,
      b.rating,
      b.review_count,
      b.business_status,
      b.type,
      b.owner_name || '',
      b.email || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `business_search_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('CSV downloaded successfully');
  };

  // Pagination calculations
  const totalPages = Math.ceil(businesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBusinesses = businesses.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-full p-4 space-y-2">
      <div className="border-b border-neutral-800 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">Business Search</h2>
        <p className="text-sm text-neutral-400">
          Search and export business information
        </p>
      </div>

      {/* Search Bar */}
      <div className="rounded-lg border border-neutral-800 p-4 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-grow">
            <Input
              placeholder="Search businesses (e.g., Hotels in San Francisco)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-input pl-10 text-slate-700"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading}
            variant="premium"
            className="w-[100px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {businesses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">
              Found {businesses.length} results
            </p>
            <Button
              onClick={downloadCSV}
              variant="outline"
              size="sm"
              className="border-neutral-800 bg-[#f059da] hover:bg-neutral-800/50 text-white"
            >
              <Download className="w-4 h-4 mr-2 bg-[#f059da] text-white" />
              Export CSV
            </Button>
          </div>
          
          <div className="rounded-lg border border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                  <TableHead className="text-neutral-400">Business</TableHead>
                  <TableHead className="text-neutral-400">Contact</TableHead>
                  <TableHead className="text-neutral-400">Owner Info</TableHead>
                  <TableHead className="text-neutral-400">Rating</TableHead>
                  <TableHead className="text-neutral-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBusinesses.map((business, index) => (
                  <TableRow 
                    key={startIndex + index} 
                    className="border-neutral-800 hover:bg-neutral-800/50"
                  >
                    <TableCell className="font-medium text-white">
                      <div>{business.name}</div>
                      <div className="text-sm text-neutral-400">
                        {business.full_address}
                      </div>
                    </TableCell>
                    <TableCell>
                      {business.phone_number && (
                        <a 
                          href={`tel:${business.phone_number}`}
                          className="text-[#f9fafb] hover:underline block"
                        >
                          {business.phone_number}
                        </a>
                      )}
                      {business.website && (
                        <a 
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#f9fafb] hover:underline block mt-1"
                        >
                          Visit Website
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      {business.owner_name && (
                        <div className="text-[#f9fafb]">
                          {business.owner_name}
                        </div>
                      )}
                      {business.email && (
                        <a 
                          href={`mailto:${business.email}`}
                          className="text-sm text-[#f9fafb] hover:underline block mt-1"
                        >
                          {business.email}
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center gap-1">
                        <span>{business.rating}</span>
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-neutral-400">
                          ({business.review_count})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        business.business_status === 'OPEN' 
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-red-900/20 text-red-400'
                      }`}>
                        {business.business_status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
              <div className="text-sm text-neutral-400">
                Showing {startIndex + 1}-{Math.min(endIndex, businesses.length)} of {businesses.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-neutral-800 hover:bg-neutral-800/50 text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`w-8 ${
                        page === currentPage
                          ? "bg-[#f059da] text-white"
                          : "border-neutral-800 hover:bg-neutral-800/50 text-white"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-neutral-800 hover:bg-neutral-800/50 text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Results Message */}
      {searchQuery && !loading && businesses.length === 0 && (
        <div className="text-center text-neutral-400 mt-8 p-8 border border-neutral-800 rounded-lg">
          No businesses found. Try a different search term.
        </div>
      )}
    </div>
  );
}