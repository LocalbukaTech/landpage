'use client';

import {useMemo} from 'react';
import {BarChart3, Users, ListCheck, TrendingUp, Loader2} from 'lucide-react';
import {useTeamsQuery} from '@/lib/api/services/teams.hooks';
import {useWaitlistQuery} from '@/lib/api/services/waitlist.hooks';

const Dashboard = () => {
  // Fetch all teams to count departments (using a large size to get all)
  const {data: teamsData, isLoading: teamsLoading} = useTeamsQuery({
    page: 1,
    size: 100,
  });
  const {data: waitlistData, isLoading: waitlistLoading} = useWaitlistQuery({
    page: 1,
    size: 1,
  });

  const totalTeamMembers = teamsData?.data?.total_docs ?? 0;
  const totalWaitlistEntries = waitlistData?.data?.total_docs ?? 0;

  // Calculate unique departments from teams
  const activeDepartments = useMemo(() => {
    const teams = teamsData?.data?.docs ?? [];
    const uniqueDepartments = new Set(teams.map((team) => team.department));
    return uniqueDepartments.size;
  }, [teamsData]);

  const stats = [
    {
      name: 'Total Team Members',
      value: totalTeamMembers,
      icon: Users,
      change: '+0%',
      changeType: 'positive',
      color: 'bg-blue-500',
      loading: teamsLoading,
    },
    {
      name: 'Waitlist Entries',
      value: totalWaitlistEntries,
      icon: ListCheck,
      change: '+0%',
      changeType: 'positive',
      color: 'bg-green-500',
      loading: waitlistLoading,
    },
    {
      name: 'Active Departments',
      value: activeDepartments,
      icon: BarChart3,
      change: '0%',
      changeType: 'neutral',
      color: 'bg-purple-500',
      loading: teamsLoading,
    },
    {
      name: 'Growth Rate',
      value: '0%',
      icon: TrendingUp,
      change: '+0%',
      changeType: 'positive',
      color: 'bg-orange-500',
      loading: false,
    },
  ];

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          Dashboard Overview
        </h1>
        <p className='text-muted-foreground'>
          Welcome back! Here&apos;s what&apos;s happening with LocalBuka.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300'>
              <div className='flex items-center justify-between mb-4'>
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className='w-6 h-6 text-white' />
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : stat.changeType === 'negative'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className='text-2xl font-bold text-foreground mb-1'>
                {stat.loading ? (
                  <Loader2 className='w-6 h-6 animate-spin' />
                ) : (
                  stat.value
                )}
              </h3>
              <p className='text-sm text-muted-foreground'>{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
        <h2 className='text-xl font-bold text-foreground mb-4'>
          Quick Actions
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <a
            href='/secure-admin/teams'
            className='flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200'>
            <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
              <Users className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>Manage Teams</h3>
              <p className='text-sm text-muted-foreground'>
                View and manage team members
              </p>
            </div>
          </a>
          <a
            href='/secure-admin/waitlist'
            className='flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200'>
            <div className='w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center'>
              <ListCheck className='w-5 h-5 text-green-600 dark:text-green-400' />
            </div>
            <div>
              <h3 className='font-semibold text-foreground'>Review Waitlist</h3>
              <p className='text-sm text-muted-foreground'>
                Check new waitlist entries
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Welcome Message */}
      <div className='bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6'>
        <h2 className='text-xl font-bold text-foreground mb-2'>
          Welcome to LocalBuka Admin
        </h2>
        <p className='text-muted-foreground'>
          Use the sidebar to navigate between Teams and Waitlist sections. All
          data is fetched from the backend API in real-time.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
