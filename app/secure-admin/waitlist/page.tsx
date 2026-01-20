'use client';

import {useState} from 'react';
import {
  ListCheck,
  Phone,
  MapPin,
  Search,
  Loader2,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {useWaitlistQuery} from '@/lib/api/services/waitlist.hooks';
import type {Waitlist} from '@/lib/api/services/waitlist.service';
import {Button} from '@/components/ui/button';
import {capitalize} from '@/lib/utils';

const PAGE_SIZE = 10;

const WaitlistPage = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const {data, isLoading, isError} = useWaitlistQuery({page, size: PAGE_SIZE});
  const waitlistData = data?.data;
  const waitlist: Waitlist[] = waitlistData?.docs ?? [];
  const totalPages = waitlistData?.total_pages ?? 1;
  const totalDocs = waitlistData?.total_docs ?? 0;

  const filteredWaitlist = waitlist.filter(
    (entry) =>
      entry.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.phone.includes(searchQuery) ||
      entry.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Phone', 'Location'];
    const rows = filteredWaitlist.map((entry) => [
      entry.first_name,
      entry.last_name,
      entry.phone,
      entry.location,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 animate-spin text-primary mx-auto mb-4' />
          <p className='text-muted-foreground'>Loading waitlist entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Waitlist Entries
          </h1>
          <p className='text-muted-foreground'>
            View and manage user waitlist submissions
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='bg-primary text-white px-6 py-3 rounded-lg font-semibold text-lg'>
            {totalDocs} Entries
          </div>
          {filteredWaitlist.length > 0 && (
            <button
              onClick={exportToCSV}
              className='flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all'>
              <Download className='w-4 h-4' />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
          <input
            type='text'
            placeholder='Search by name, phone, or location...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent'
          />
        </div>
      </div>

      {/* Error Message */}
      {isError && (
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg'>
          Failed to load waitlist entries. Please try again.
        </div>
      )}

      {/* Waitlist Table */}
      {filteredWaitlist.length === 0 ? (
        <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center'>
          <ListCheck className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            No waitlist entries found
          </h3>
          <p className='text-muted-foreground'>
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Waitlist entries will appear here once users sign up'}
          </p>
        </div>
      ) : (
        <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-foreground'>
                    Name
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-foreground'>
                    Phone
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-foreground'>
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                {filteredWaitlist.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-linear-to-br from-secondary to-secondary/60 rounded-full flex items-center justify-center shrink-0'>
                          <span className='text-white font-semibold text-sm uppercase'>
                            {entry.first_name[0]}
                            {entry.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className='font-medium text-foreground'>
                            {capitalize(entry.first_name)}{' '}
                            {capitalize(entry.last_name)}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            Entry #
                            {totalDocs - ((page - 1) * PAGE_SIZE + index)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2 text-sm text-foreground'>
                        <Phone className='w-4 h-4 text-muted-foreground' />
                        {entry.phone}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2 text-sm text-foreground'>
                        <MapPin className='w-4 h-4 text-muted-foreground' />
                        {entry.location}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2 pt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}>
            <ChevronLeft className='w-4 h-4' />
            Previous
          </Button>
          <span className='px-4 py-2 text-sm text-muted-foreground'>
            Page {page} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}>
            Next
            <ChevronRight className='w-4 h-4' />
          </Button>
        </div>
      )}
    </div>
  );
};

export default WaitlistPage;
