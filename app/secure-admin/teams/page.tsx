'use client';

import {useState} from 'react';
import {
  Users,
  Briefcase,
  Phone,
  FileText,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
} from 'lucide-react';
import Image from 'next/image';
import {
  useTeamsQuery,
  useDeleteTeamMutation,
  useUpdateTeamMutation,
  useUpdateTeamStatusMutation,
} from '@/lib/api/services/teams.hooks';
import type {Team} from '@/lib/api/services/teams.service';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import {RiLinkedinFill} from 'react-icons/ri';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {capitalize} from '@/lib/utils';

const PAGE_SIZE = 10;

type StatusFilter = 'all' | 'pending' | 'approved';

const TeamsPage = () => {
  const {toast} = useToast();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Modal states
  const [viewTeam, setViewTeam] = useState<Team | null>(null);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [deleteTeam, setDeleteTeam] = useState<Team | null>(null);
  const [statusChangeTeam, setStatusChangeTeam] = useState<{
    team: Team;
    action: 'approve' | 'reject';
  } | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    linkedin_url: '',
    department: '',
    position: '',
    description: '',
  });
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>('');

  // Build query params based on status filter
  const getQueryParams = () => {
    const params: {
      page: number;
      size: number;
      approved?: boolean;
      all?: boolean;
    } = {
      page,
      size: PAGE_SIZE,
    };

    if (statusFilter === 'all') {
      params.all = true;
    } else if (statusFilter === 'approved') {
      params.approved = true;
      params.all = false;
    } else {
      // pending (unapproved)
      params.approved = false;
      params.all = false;
    }

    return params;
  };

  const {data, isLoading, isError} = useTeamsQuery(getQueryParams());
  const teams: Team[] = data?.data.docs ?? [];
  const totalPages = data?.data.total_pages ?? 1;
  const totalDocs = data?.data.total_docs ?? 0;

  const deleteMutation = useDeleteTeamMutation();
  const updateMutation = useUpdateTeamMutation();
  const statusMutation = useUpdateTeamStatusMutation();

  const departments = [
    'All',
    'Operations',
    'Engineering',
    'Product',
    'Human Resource',
    'Brand & Finance',
  ];

  const statusTabs = [
    {id: 'all' as const, label: 'All Members', icon: Users},
    {id: 'pending' as const, label: 'Pending Review', icon: Clock},
    {id: 'approved' as const, label: 'Approved', icon: CheckCircle},
  ];

  const filteredTeams = teams.filter((member) => {
    const matchesSearch =
      member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === 'all' ||
      member.department.toLowerCase() === selectedDepartment.toLowerCase();

    return matchesSearch && matchesDepartment;
  });

  const handleStatusChange = () => {
    if (!statusChangeTeam) return;

    const {team, action} = statusChangeTeam;
    const approved = action === 'approve';

    statusMutation.mutate(
      {id: team.id, approved},
      {
        onSuccess: () => {
          toast({
            title: approved ? 'Team member approved' : 'Team member rejected',
            description: approved
              ? `${capitalize(team.first_name)} ${capitalize(
                  team.last_name
                )} is now visible on the public team page.`
              : `${capitalize(team.first_name)} ${capitalize(
                  team.last_name
                )} has been moved to pending.`,
            variant: 'success',
          });
          setStatusChangeTeam(null);
        },
        onError: () => {
          toast({
            title: 'Action failed',
            description:
              'Could not update team member status. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleOpenEdit = (member: Team) => {
    setEditTeam(member);
    setEditForm({
      first_name: member.first_name,
      last_name: member.last_name,
      phone: member.phone,
      linkedin_url: member.linkedin_url ?? '',
      department: member.department,
      position: member.position,
      description: member.description ?? '',
    });
    setEditImage(null);
    setEditImagePreview('');
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const {width, height} = img;
      URL.revokeObjectURL(url);

      if (width !== 768 || height !== 1344) {
        e.target.value = '';
        setEditImage(null);
        setEditImagePreview('');
        toast({
          title: 'Invalid image size',
          description:
            'Please upload an image with dimensions 768×1344 pixels.',
          variant: 'destructive',
        });
        return;
      }

      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      e.target.value = '';
      setEditImage(null);
      setEditImagePreview('');
      toast({
        title: 'Invalid image file',
        description: 'We could not read this image. Please try another file.',
        variant: 'destructive',
      });
    };

    img.src = url;
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setEditForm({...editForm, [e.target.name]: e.target.value});
  };

  const handleEditSubmit = () => {
    if (!editTeam) return;

    const formData = new FormData();
    formData.append('first_name', editForm.first_name);
    formData.append('last_name', editForm.last_name);
    formData.append('phone', editForm.phone);
    formData.append('linkedin_url', editForm.linkedin_url);
    formData.append('department', editForm.department);
    formData.append('position', editForm.position);
    formData.append('description', editForm.description);
    if (editImage) {
      formData.append('image', editImage);
    }

    updateMutation.mutate(
      {id: editTeam.id, data: formData},
      {
        onSuccess: () => {
          toast({
            title: 'Team member updated',
            description: 'The team member has been updated successfully.',
            variant: 'success',
          });
          setEditTeam(null);
        },
        onError: () => {
          toast({
            title: 'Update failed',
            description: 'Could not update team member. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteTeam) return;

    deleteMutation.mutate(deleteTeam.id, {
      onSuccess: () => {
        toast({
          title: 'Team member deleted',
          description: 'The team member has been removed.',
          variant: 'success',
        });
        setDeleteTeam(null);
      },
      onError: () => {
        toast({
          title: 'Delete failed',
          description: 'Could not delete team member. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 animate-spin text-primary mx-auto mb-4' />
          <p className='text-muted-foreground'>Loading team members...</p>
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
            Team Members
          </h1>
          <p className='text-muted-foreground'>
            Manage team members and review submissions
          </p>
        </div>
        <div className='bg-primary text-white px-6 py-3 rounded-lg font-semibold text-lg'>
          {totalDocs}{' '}
          {statusFilter === 'all'
            ? 'Total'
            : statusFilter === 'pending'
            ? 'Pending'
            : 'Approved'}
        </div>
      </div>

      {/* Status Tabs */}
      <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-2'>
        <div className='flex gap-2'>
          {statusTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                <Icon className='w-4 h-4' />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search by name or position...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className='px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent'>
            {departments.map((dept) => (
              <option key={dept} value={dept.toLowerCase()}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {isError && (
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg'>
          Failed to load team members. Please try again.
        </div>
      )}

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center'>
          <Users className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            No team members found
          </h3>
          <p className='text-muted-foreground'>
            {searchQuery || selectedDepartment !== 'all'
              ? 'Try adjusting your filters'
              : statusFilter === 'pending'
              ? 'No pending submissions to review'
              : statusFilter === 'approved'
              ? 'No approved team members yet'
              : 'Team members will appear here once they submit the form'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {filteredTeams.map((member) => (
            <div
              key={member.id}
              className={`bg-white dark:bg-gray-900 border rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${
                member.approved
                  ? 'border-gray-200 dark:border-gray-800'
                  : 'border-amber-300 dark:border-amber-700'
              }`}>
              {/* Status Badge */}
              <div className='flex items-center justify-between mb-4'>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    member.approved
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                  {member.approved ? (
                    <>
                      <CheckCircle className='w-3 h-3' />
                      Approved
                    </>
                  ) : (
                    <>
                      <Clock className='w-3 h-3' />
                      Pending Review
                    </>
                  )}
                </span>
                {/* Quick Actions for Status */}
                <div className='flex items-center gap-1'>
                  {!member.approved ? (
                    <TooltipProvider>
                      <Tooltip delayDuration={150}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              setStatusChangeTeam({
                                team: member,
                                action: 'approve',
                              })
                            }
                            className='p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors'>
                            <UserCheck className='w-4 h-4' />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Approve member</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip delayDuration={150}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              setStatusChangeTeam({
                                team: member,
                                action: 'reject',
                              })
                            }
                            className='p-1.5 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors'>
                            <UserX className='w-4 h-4' />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Move to pending</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              <div className='flex gap-4'>
                {/* Profile Image */}
                <div className='shrink-0'>
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={`${member.first_name} ${member.last_name}`}
                      width={80}
                      height={80}
                      className='rounded-lg object-cover w-20 h-20'
                    />
                  ) : (
                    <div className='w-20 h-20 bg-linear-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center'>
                      <span className='text-2xl font-bold text-white uppercase'>
                        {member.first_name[0]}
                        {member.last_name[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <h3 className='text-xl font-bold text-foreground mb-1'>
                    {capitalize(member.first_name)}{' '}
                    {capitalize(member.last_name)}
                  </h3>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium'>
                      <Briefcase className='w-3 h-3' />
                      {member.department}
                    </span>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Users className='w-4 h-4' />
                      <span>{member.position}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Phone className='w-4 h-4' />
                      <span>{member.phone}</span>
                    </div>
                    {member.linkedin_url && (
                      <div className='flex items-center gap-2 text-sm'>
                        <RiLinkedinFill className='w-4 h-4 text-blue-500' />
                        <a
                          href={member.linkedin_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:underline truncate'>
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {member.description && (
                      <div className='flex items-start gap-2 text-sm text-muted-foreground mt-3 pt-3 border-t border-gray-200 dark:border-gray-800'>
                        <FileText className='w-4 h-4 mt-0.5 shrink-0' />
                        <p className='line-clamp-2'>{member.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setViewTeam(member)}
                      className='flex items-center gap-1'>
                      <Eye className='w-4 h-4' />
                      View
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleOpenEdit(member)}
                      className='flex items-center gap-1'>
                      <Pencil className='w-4 h-4' />
                      Edit
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setDeleteTeam(member)}
                      className='flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20'>
                      <Trash2 className='w-4 h-4' />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

      {/* View Modal */}
      {viewTeam && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-bold'>Team Member Details</h2>
                <button
                  onClick={() => setViewTeam(null)}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'>
                  <X className='w-5 h-5' />
                </button>
              </div>

              <div className='flex flex-col items-center mb-6'>
                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                    viewTeam.approved
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                  {viewTeam.approved ? (
                    <>
                      <CheckCircle className='w-3 h-3' />
                      Approved
                    </>
                  ) : (
                    <>
                      <Clock className='w-3 h-3' />
                      Pending Review
                    </>
                  )}
                </span>

                {viewTeam.image_url ? (
                  <Image
                    src={viewTeam.image_url}
                    alt={`${viewTeam.first_name} ${viewTeam.last_name}`}
                    width={120}
                    height={120}
                    className='rounded-full object-cover w-30 h-30'
                  />
                ) : (
                  <div className='w-30 h-30 bg-linear-to-br from-primary to-primary/60 rounded-full flex items-center justify-center'>
                    <span className='text-4xl font-bold text-white uppercase'>
                      {viewTeam.first_name[0]}
                      {viewTeam.last_name[0]}
                    </span>
                  </div>
                )}
                <h3 className='text-2xl font-bold mt-4'>
                  {capitalize(viewTeam.first_name)}{' '}
                  {capitalize(viewTeam.last_name)}
                </h3>
                <p className='text-primary font-medium'>{viewTeam.position}</p>
                <span className='mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm'>
                  {viewTeam.department}
                </span>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <Phone className='w-5 h-5 text-muted-foreground' />
                  <span>{viewTeam.phone}</span>
                </div>
                {viewTeam.email && (
                  <div className='flex items-center gap-3'>
                    <FileText className='w-5 h-5 text-muted-foreground' />
                    <span>{viewTeam.email}</span>
                  </div>
                )}
                {viewTeam.linkedin_url && (
                  <div className='flex items-center gap-3'>
                    <RiLinkedinFill className='w-4 h-4 text-blue-500' />
                    <a
                      href={viewTeam.linkedin_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'>
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {viewTeam.description && (
                  <div className='pt-3 border-t'>
                    <p className='text-sm text-muted-foreground'>
                      {viewTeam.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 mt-6'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={() => setViewTeam(null)}>
                  Close
                </Button>
                {!viewTeam.approved ? (
                  <Button
                    className='flex-1 bg-green-600 hover:bg-green-700 text-white'
                    onClick={() => {
                      setViewTeam(null);
                      setStatusChangeTeam({team: viewTeam, action: 'approve'});
                    }}>
                    <UserCheck className='w-4 h-4 mr-2' />
                    Approve
                  </Button>
                ) : (
                  <Button
                    variant='outline'
                    className='flex-1 text-amber-600 border-amber-300 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20'
                    onClick={() => {
                      setViewTeam(null);
                      setStatusChangeTeam({team: viewTeam, action: 'reject'});
                    }}>
                    <UserX className='w-4 h-4 mr-2' />
                    Move to Pending
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTeam && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-bold'>Edit Team Member</h2>
                <button
                  onClick={() => setEditTeam(null)}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'>
                  <X className='w-5 h-5' />
                </button>
              </div>

              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium mb-1'>
                      First Name
                    </label>
                    <input
                      type='text'
                      name='first_name'
                      value={editForm.first_name}
                      onChange={handleEditChange}
                      className='w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-1'>
                      Last Name
                    </label>
                    <input
                      type='text'
                      name='last_name'
                      value={editForm.last_name}
                      onChange={handleEditChange}
                      className='w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    LinkedIn URL
                  </label>
                  <input
                    type='url'
                    name='linkedin_url'
                    value={editForm.linkedin_url}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Department
                  </label>
                  <select
                    name='department'
                    value={editForm.department}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'>
                    <option value='Operations'>Operations</option>
                    <option value='Engineering'>Engineering</option>
                    <option value='Product'>Product</option>
                    <option value='Human Resource'>Human Resource</option>
                    <option value='Brand & Finance'>Brand & Finance</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Position
                  </label>
                  <input
                    type='text'
                    name='position'
                    value={editForm.position}
                    onChange={handleEditChange}
                    className='w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows={3}
                    className='w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 resize-none'
                  />
                </div>

                <TooltipProvider>
                  <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>
                      <div>
                        <label className='block text-sm font-medium mb-1'>
                          New Image (optional)
                        </label>
                        <input
                          type='file'
                          accept='image/*'
                          onChange={handleEditImageChange}
                          className='w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                        />
                        {editImagePreview && (
                          <div className='mt-2'>
                            <p className='text-xs text-muted-foreground mb-1'>
                              Preview:
                            </p>
                            <Image
                              src={editImagePreview}
                              alt='Preview'
                              width={64}
                              height={112}
                              className='w-16 h-28 rounded-lg object-cover border border-gray-300 dark:border-gray-700'
                            />
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side='top'
                      align='start'
                      collisionPadding={16}
                      className='max-w-[calc(100vw-2rem)] sm:max-w-sm px-4 py-3'>
                      <p className='font-semibold mb-1'>Image requirements</p>
                      <p className='text-xs sm:text-sm text-neutral-200'>
                        Please upload a clear portrait image in JPG, PNG, or
                        WebP format, with exact dimensions of
                        <span className='font-semibold'>
                          {' '}
                          768×1344 pixels
                        </span>{' '}
                        for the best display quality on the team page. Try
                        https://imageresizer.com/
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className='flex gap-3 mt-6'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={() => setEditTeam(null)}>
                  Cancel
                </Button>
                <Button
                  className='flex-1'
                  onClick={handleEditSubmit}
                  disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTeam && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full mx-4'>
            <div className='p-6'>
              <div className='flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full'>
                <Trash2 className='w-6 h-6 text-red-600' />
              </div>
              <h2 className='text-xl font-bold text-center mb-2'>
                Delete Team Member
              </h2>
              <p className='text-center text-muted-foreground mb-6'>
                Are you sure you want to delete{' '}
                <span className='font-semibold'>
                  {capitalize(deleteTeam.first_name)}{' '}
                  {capitalize(deleteTeam.last_name)}
                </span>
                ? This action cannot be undone.
              </p>

              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={() => setDeleteTeam(null)}>
                  Cancel
                </Button>
                <Button
                  className='flex-1 bg-red-600 hover:bg-red-700 text-white'
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {statusChangeTeam && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full mx-4'>
            <div className='p-6'>
              <div
                className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full ${
                  statusChangeTeam.action === 'approve'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                {statusChangeTeam.action === 'approve' ? (
                  <UserCheck className='w-6 h-6 text-green-600' />
                ) : (
                  <UserX className='w-6 h-6 text-amber-600' />
                )}
              </div>
              <h2 className='text-xl font-bold text-center mb-2'>
                {statusChangeTeam.action === 'approve'
                  ? 'Approve Team Member'
                  : 'Move to Pending'}
              </h2>
              <p className='text-center text-muted-foreground mb-6'>
                {statusChangeTeam.action === 'approve' ? (
                  <>
                    Are you sure you want to approve{' '}
                    <span className='font-semibold'>
                      {capitalize(statusChangeTeam.team.first_name)}{' '}
                      {capitalize(statusChangeTeam.team.last_name)}
                    </span>
                    ? They will be visible on the public team page.
                  </>
                ) : (
                  <>
                    Are you sure you want to move{' '}
                    <span className='font-semibold'>
                      {capitalize(statusChangeTeam.team.first_name)}{' '}
                      {capitalize(statusChangeTeam.team.last_name)}
                    </span>{' '}
                    back to pending? They will no longer be visible on the
                    public team page.
                  </>
                )}
              </p>

              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={() => setStatusChangeTeam(null)}>
                  Cancel
                </Button>
                <Button
                  className={`flex-1 ${
                    statusChangeTeam.action === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  } text-white`}
                  onClick={handleStatusChange}
                  disabled={statusMutation.isPending}>
                  {statusMutation.isPending
                    ? 'Processing...'
                    : statusChangeTeam.action === 'approve'
                    ? 'Approve'
                    : 'Move to Pending'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
