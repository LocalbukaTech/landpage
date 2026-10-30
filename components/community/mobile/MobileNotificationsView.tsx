"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Star, X } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "./mockData";

interface MobileNotificationsViewProps {
  onBack: () => void;
}

export function MobileNotificationsView({
  onBack,
}: MobileNotificationsViewProps) {
  const notifications = MOCK_NOTIFICATIONS;
  const [followedBackUsers, setFollowedBackUsers] = useState<
    Record<string, boolean>
  >({});
  const [showRestaurantCard, setShowRestaurantCard] = useState(true);

  const newNotifications = notifications.filter((n) => n.isNew);
  const yesterdayNotifications = notifications.filter((n) => !n.isNew);

  const handleFollowBack = (id: string) => {
    setFollowedBackUsers((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-[#141414] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 h-13 bg-[#141414]/95 backdrop-blur-md border-b border-white/5">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft size={21} />
        </button>
        <h1 className="text-base font-bold text-white">Notifications</h1>
      </header>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-12">
        {/* NEW Section */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            New
          </h2>

          <div className="space-y-3.5">
            {newNotifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-center justify-between gap-3 text-xs"
              >
                {/* Left: Avatar + Title & Time */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-700 shrink-0 relative border border-white/10">
                    <Image
                      src={notif.avatar}
                      alt="User avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-white text-xs font-medium leading-tight">
                      {notif.title}
                    </p>
                    <span className="text-[10.5px] text-zinc-400">
                      {notif.time}
                    </span>
                  </div>
                </div>

                {/* Right Action: Thumbnail or Follow Back */}
                <div className="shrink-0">
                  {notif.type === "follow" ? (
                    followedBackUsers[notif.id] ? (
                      <span className="text-[10px] text-zinc-400 font-semibold px-2">
                        Following
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleFollowBack(notif.id)}
                        className="bg-[#fbbe15] text-[#141414] text-[10.5px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#eab308] active:scale-95 transition-all cursor-pointer"
                      >
                        Follow back
                      </button>
                    )
                  ) : notif.thumbnail ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-white/10 relative">
                      <Image
                        src={notif.thumbnail}
                        alt="Post media"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* YESTERDAY Section */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            Yesterday
          </h2>

          <div className="space-y-4">
            {yesterdayNotifications.map((notif) => (
              <div key={notif.id} className="space-y-2.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  {/* Left: Avatar + Title & Time */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#fbbe15]/20 shrink-0 relative border border-[#fbbe15]/30 flex items-center justify-center">
                      <Image
                        src={notif.avatar}
                        alt="Avatar"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-white text-xs font-medium leading-tight">
                        {notif.title}
                      </p>
                      <span className="text-[10.5px] text-zinc-400">
                        {notif.time}
                      </span>
                    </div>
                  </div>

                  {/* Right Thumbnail */}
                  {notif.thumbnail && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-white/10 relative">
                      <Image
                        src={notif.thumbnail}
                        alt="Post media"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Embedded Restaurant Card (Image 2 Screen 5) */}
                {notif.restaurantCard && showRestaurantCard && (
                  <div className="ml-12 rounded-xl bg-[#1e1e1e] border border-white/10 p-3 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => setShowRestaurantCard(false)}
                      className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-white cursor-pointer"
                      aria-label="Dismiss recommendation"
                    >
                      <X size={14} />
                    </button>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <span>{notif.restaurantCard.name}</span>
                      <div className="flex items-center text-[#fbbe15] text-[11px]">
                        <Star size={11} className="fill-[#fbbe15]" />
                        <span className="ml-0.5">
                          {notif.restaurantCard.rating}
                        </span>
                        <span className="text-zinc-400 font-normal ml-0.5">
                          ({notif.restaurantCard.reviews})
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-snug">
                      {notif.restaurantCard.address}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
