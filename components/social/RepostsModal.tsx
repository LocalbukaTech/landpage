'use client';

import BaseModal from './BaseModal';
import UserRow from './UserRow';
import {usePostReposts} from '@/lib/api/services/posts.hooks';
import {Loader2} from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  postId: string;
}

export default function RepostsModal({open, onClose, postId}: Props) {
  const {data: repostsResp, isLoading} = usePostReposts(postId, {
    page: 1,
    pageSize: 50,
  });

  const repostUsers =
    (repostsResp as any)?.data?.data ||
    (repostsResp as any)?.data ||
    [];

  return (
    <BaseModal open={open} onClose={onClose} title="Reposted by">
      <div className="flex flex-col -mx-5">
        <div className="bg-[#1F1F1F] overflow-y-auto h-[480px] px-4 py-3 custom-scrollbar rounded-b-2xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-[#fbbe15]" />
            </div>
          ) : repostUsers.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
              No reposts yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {repostUsers.map((item: any) => {
                const userData = item.user || item;
                return (
                  <UserRow
                    key={userData.id}
                    user={userData}
                    isFollowingInitial={userData.isFollowing}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
