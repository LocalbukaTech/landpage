'use client';

import {useState} from 'react';
import Link from 'next/link';
import {Search, Calendar, SlidersHorizontal, Eye, Loader2} from 'lucide-react';
import {StatusBadge} from '@/components/admin/ui/StatusBadge';
import {Pagination} from '@/components/admin/ui/Pagination';
import {MdVerified} from 'react-icons/md';
import {useRestaurants} from '@/lib/api/services/restaurants.hooks';
import {format} from 'date-fns';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default function BukaManagement() {
  const [selectedRestaurants, setSelectedRestaurants] = useState<Set<string>>(
    new Set(),
  );
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('approved');

  const {data, isLoading, isFetching} = useRestaurants({
    page,
    pageSize: 10,
    status: statusFilter,
  });

  const restaurants = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRestaurants(new Set(restaurants.map((b) => b.id || '')));
    } else {
      setSelectedRestaurants(new Set());
    }
  };

  const handleSelectRestaurant = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRestaurants);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRestaurants(newSelected);
  };

  const isAllSelected =
    restaurants.length > 0 && selectedRestaurants.size === restaurants.length;

  return (
    <div className='flex flex-col gap-6'>
      <div className='w-full max-w-6xl mx-auto flex flex-col gap-4 mt-8'>
        <div className='bg-white border border-gray-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col min-h-[600px]'>
          {/* Toolbar */}
          <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-100 rounded-t-xl'>
            <div className='relative w-[300px]'>
              <Search
                className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300'
                size={16}
              />
              <input
                type='text'
                placeholder='Search disabled...'
                disabled
                className='w-full bg-gray-50 border border-gray-100 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-400 cursor-not-allowed opacity-60 focus:outline-none'
              />
            </div>

            <div className='flex items-center gap-5 pr-1'>
              <div className='flex items-center gap-2'>
                <span className='text-[11px] text-gray-400 uppercase font-bold tracking-wider'>
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className='text-sm bg-transparent border-none focus:ring-0 text-gray-600 font-semibold cursor-pointer outline-none'>
                  <option value='approved'>Approved</option>
                  <option value='pending'>Pending</option>
                  <option value='rejected'>Rejected</option>
                  <option value='suspended'>Suspended</option>
                </select>
              </div>

              <div className='relative flex items-center'>
                <input
                  type='date'
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                  onClick={(e) => {
                    try {
                      if ('showPicker' in HTMLInputElement.prototype) {
                        e.currentTarget.showPicker();
                      }
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                />
                <button className='flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors pointer-events-none'>
                  <Calendar size={15} />
                  Date
                </button>
              </div>

              <button className='flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors'>
                <SlidersHorizontal size={15} />
                Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className='flex flex-col grow relative'>
            {(isLoading || isFetching) && (
              <div className='absolute inset-0 bg-white/50 flex items-center justify-center z-10 backdrop-blur-[1px] rounded-b-xl'>
                <div className='flex flex-col items-center gap-2'>
                  <Loader2 className='animate-spin text-[#fbbe15] w-7 h-7' />
                  <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-widest'>
                    Loading...
                  </span>
                </div>
              </div>
            )}

            {!isLoading && restaurants.length === 0 && (
              <div className='flex flex-col justify-center items-center grow text-gray-300 gap-3 py-24'>
                <Search size={44} strokeWidth={1} />
                <p className='text-sm font-medium uppercase tracking-widest'>
                  No restaurants found
                </p>
              </div>
            )}

            {restaurants.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow className='bg-[#F8F9FA] hover:bg-[#F8F9FA] border-b border-gray-100'>
                    <TableHead className='w-10 pl-5'>
                      <input
                        type='checkbox'
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className='w-4 h-4 rounded border-gray-300 accent-[#fbbe15] cursor-pointer'
                      />
                    </TableHead>
                    <TableHead className='text-[11px] font-bold uppercase tracking-wider text-gray-400 w-24'>
                      ID
                    </TableHead>
                    <TableHead className='text-[11px] font-bold uppercase tracking-wider text-gray-400'>
                      Restaurant Name
                    </TableHead>
                    <TableHead className='text-[11px] font-bold uppercase tracking-wider text-gray-400 max-w-[200px]'>
                      Address
                    </TableHead>
                    <TableHead className='text-[11px] font-bold uppercase tracking-wider text-gray-400 w-28'>
                      Date Added
                    </TableHead>
                    <TableHead className='text-[11px] font-bold uppercase tracking-wider text-gray-400'>
                      Owner
                    </TableHead>
                    <TableHead className='text-[11px] font-bold uppercase tracking-wider text-gray-400 w-24'>
                      Source
                    </TableHead>
                    <TableHead className='text-[11px] font-bold uppercase tracking-wider text-gray-400 w-28'>
                      Status
                    </TableHead>
                    <TableHead className='w-12' />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {restaurants.map((buka, i) => {
                    const isSelected = buka.id
                      ? selectedRestaurants.has(buka.id)
                      : false;
                    const displayDate = buka.createdAt
                      ? format(new Date(buka.createdAt), 'dd/MM/yy')
                      : 'N/A';

                    const ownerBlock = buka.owner ? (
                      <div className='flex flex-col leading-tight'>
                        <span className='font-semibold text-gray-800 truncate max-w-[140px]'>
                          {buka.owner.firstName} {buka.owner.lastName}
                        </span>
                        <span className='text-[11px] text-gray-400 truncate max-w-[140px] mt-0.5'>
                          {buka.owner.email}
                        </span>
                      </div>
                    ) : (
                      <span className='text-xs italic text-gray-400'>
                        {buka?.ownerId
                          ? buka.ownerId.slice(0, 16) + '…'
                          : 'Imported from Google'}
                      </span>
                    );

                    return (
                      <TableRow
                        key={buka.id || i}
                        data-state={isSelected ? 'selected' : undefined}
                        className={`border-b border-gray-50 text-[13px] text-gray-600 transition-colors ${
                          isSelected
                            ? 'bg-[#FCF7E8]/50 hover:bg-[#FCF7E8]/70'
                            : 'hover:bg-[#F8F9FA]'
                        }`}>
                        <TableCell className='pl-5'>
                          <input
                            type='checkbox'
                            checked={isSelected}
                            onChange={(e) =>
                              buka.id &&
                              handleSelectRestaurant(buka.id, e.target.checked)
                            }
                            className='w-4 h-4 rounded border-gray-300 accent-[#fbbe15] cursor-pointer'
                          />
                        </TableCell>

                        <TableCell
                          className='font-mono text-[11px] text-gray-400 uppercase'
                          title={buka.id || ''}>
                          {buka.id?.slice(0, 8)}
                        </TableCell>

                        <TableCell className='max-w-[180px]'>
                          <div
                            className='flex items-center gap-1.5 truncate'
                            title={buka.name}>
                            <span className='text-gray-800 font-bold truncate'>
                              {buka.name}
                            </span>
                            {buka.source === 'google' && (
                              <MdVerified
                                className='text-[#fbbe15] shrink-0'
                                size={14}
                                title='Verified Source'
                              />
                            )}
                          </div>
                        </TableCell>

                        <TableCell
                          className='text-gray-500 text-[12px] max-w-[200px] truncate'
                          title={buka.address}>
                          {buka.address}
                        </TableCell>

                        <TableCell className='text-gray-500 font-medium tabular-nums'>
                          {displayDate}
                        </TableCell>

                        <TableCell>{ownerBlock}</TableCell>

                        <TableCell className='text-gray-500 capitalize'>
                          {buka.source}
                        </TableCell>

                        <TableCell>
                          <StatusBadge status={buka.status || ''} />
                        </TableCell>

                        <TableCell className='pr-4'>
                          {buka.id && (
                            <Link
                              href={`/secure-admin/buka-management/${buka.id}`}
                              className='w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-white hover:text-[#fbbe15] hover:shadow-sm transition-all'>
                              <Eye size={16} />
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
