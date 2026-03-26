"use client";

import { useEffect, useMemo } from "react";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useNotifications, useMarkReadMutation, useMarkAllReadMutation } from "@/lib/api/services/notifications.hooks";
import { Notification } from "@/lib/api/services/notifications.service";
import { formatDistanceToNow } from "date-fns";

interface NotificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS: any[] = [
  {
    "id": "200f5a0a-996c-4195-8ffe-7605fa553298",
    "recipientId": "58850ede-7854-468d-afd0-74e7ea353eaf",
    "actorId": "7f922955-f64e-45bb-89c3-2dfaf6c0e84a",
    "type": "like_post",
    "entityId": "67abc33c-b4c3-4779-9962-a3f7554f261d",
    "entityType": "post",
    "message": "liked your post",
    "isRead": false,
    "createdAt": "2026-03-25T23:03:20.223Z",
    "actor": {
      "id": "7f922955-f64e-45bb-89c3-2dfaf6c0e84a",
      "fullName": "matthias bleden",
      "username": "matthias",
      "avatar": "http://res.cloudinary.com/de97zul4x/image/upload/v1774468986/zdvfd8etoo12jfivcpuz.png"
    }
  },
  {
    "id": "af551711-e4df-46f2-b1ea-d828e3bb709a",
    "recipientId": "58850ede-7854-468d-afd0-74e7ea353eaf",
    "actorId": "7f922955-f64e-45bb-89c3-2dfaf6c0e84a",
    "type": "unlike_post",
    "entityId": "67abc33c-b4c3-4779-9962-a3f7554f261d",
    "entityType": "post",
    "message": "unliked your post",
    "isRead": false,
    "createdAt": "2026-03-25T22:34:31.554Z",
    "actor": {
      "id": "7f922955-f64e-45bb-89c3-2dfaf6c0e84a",
      "fullName": "matthias bleden",
      "username": "matthias",
      "avatar": "http://res.cloudinary.com/de97zul4x/image/upload/v1774468986/zdvfd8etoo12jfivcpuz.png"
    }
  },
  {
    "id": "36a43c1f-4aa3-469f-ad0e-b028299fb305",
    "recipientId": "58850ede-7854-468d-afd0-74e7ea353eaf",
    "actorId": "7f922955-f64e-45bb-89c3-2dfaf6c0e84a",
    "type": "follow",
    "entityId": "7f922955-f64e-45bb-89c3-2dfaf6c0e84a",
    "entityType": "user",
    "message": "started following you",
    "isRead": false,
    "createdAt": "2026-03-25T22:28:27.729Z",
    "actor": {
      "id": "7f922955-f64e-45bb-89c3-2dfaf6c0e84a",
      "fullName": "matthias bleden",
      "username": "matthias",
      "avatar": "http://res.cloudinary.com/de97zul4x/image/upload/v1774468986/zdvfd8etoo12jfivcpuz.png"
    }
  }
];

export function NotificationOverlay({ isOpen, onClose }: NotificationOverlayProps) {
  const { data: notificationsData, isLoading } = useNotifications();
  const markReadMutation = useMarkReadMutation();
  const markAllReadMutation = useMarkAllReadMutation();

  // Reach the actual array: ApiResponse.data (PaginatedResponse) .data (Array)
  const apiNotifications = (notificationsData as any)?.data?.data || [];
  const notifications = apiNotifications.length > 0 ? apiNotifications : MOCK_NOTIFICATIONS;


  // Group notifications
  const { newNotifications, olderNotifications } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (notifications as Notification[]).reduce(
      (acc, notif) => {
        const date = new Date(notif.createdAt);
        if (date >= today) {
          acc.newNotifications.push(notif);
        } else {
          acc.olderNotifications.push(notif);
        }
        return acc;
      },
      { newNotifications: [] as Notification[], olderNotifications: [] as Notification[] }
    );
  }, [notifications]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-[80px] w-[350px] bottom-0 bg-[#1a1a1a] z-100 p-6 flex flex-col border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.4)] animate-[slideInDrawer_0.3s_ease-out]">
      <div className="w-full flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-lg font-medium">Notifications</h2>
          <div className="flex items-center gap-2">
            {(notifications as Notification[]).some(n => !n.isRead) && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                className="text-[11px] text-[#fbbe15] hover:underline bg-transparent border-none cursor-pointer"
              >
                Mark all as read
              </button>
            )}
            <button
              className="flex items-center justify-center w-8 h-8 bg-[#3a3a3a] rounded-md text-[#a0a0a0] transition-all duration-200 hover:bg-[#4a4a4a] hover:text-white border-none cursor-pointer"
              onClick={onClose}
              aria-label="Close notifications"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#fbbe15]" size={32} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <X className="text-zinc-500" size={32} />
            </div>
            <p className="text-white text-sm font-medium">No notifications yet</p>
            <p className="text-zinc-500 text-xs mt-1">When you get likes or follows, they&apos;ll show up here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {/* New Section */}
            {newNotifications.length > 0 && (
              <div>
                <h3 className="text-white text-[15px] font-medium mb-4">New</h3>
                <div className="flex flex-col gap-4">
                  {newNotifications.map((notif: Notification) => (
                    <NotificationItem
                      key={notif.id}
                      notification={notif}
                      onMarkRead={() => !notif.isRead && markReadMutation.mutate(notif.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Older Section */}
            {olderNotifications.length > 0 && (
              <div>
                <h3 className="text-white text-[15px] font-medium mb-4">Earlier</h3>
                <div className="flex flex-col gap-4">
                  {olderNotifications.map((notif: Notification) => (
                    <NotificationItem
                      key={notif.id}
                      notification={notif}
                      onMarkRead={() => !notif.isRead && markReadMutation.mutate(notif.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


function NotificationItem({
  notification,
  onMarkRead
}: {
  notification: Notification;
  onMarkRead: () => void;
}) {
  const timeAgo = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
    } catch (e) {
      return "just now";
    }
  }, [notification.createdAt]);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 p-2 rounded-xl transition-colors cursor-pointer group",
        !notification.isRead ? "bg-white/5" : "hover:bg-white/5"
      )}
      onClick={onMarkRead}
    >
      <div className="flex gap-3 items-center flex-1">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700 shrink-0 relative border border-white/10">
          {notification.actor?.avatar ? (
            <Image
              src={notification.actor.avatar}
              alt={notification.actor.fullName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#fbbe15] text-[#1a1a1a] font-bold text-xs">
              {notification.actor?.fullName?.charAt(0) || "U"}
            </div>
          )}
          {!notification.isRead && (
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#fbbe15] rounded-full border-2 border-[#1a1a1a]" />
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-white text-sm leading-tight">
            <span className="font-bold">{notification.actor?.fullName || "A user"}</span>{" "}
            <span className="text-zinc-300 font-normal">{notification.message}</span>
          </p>
          <span className="text-zinc-500 text-[11px] mt-0.5">{timeAgo}</span>
        </div>
      </div>

      {notification.type === "follow" && (
        <button className="bg-[#fbbe15] text-[#1a1a1a] text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#e5ac10] transition-colors shrink-0">
          Follow back
        </button>
      )}
    </div>
  );
}

