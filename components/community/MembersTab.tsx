"use client";

import { useState } from "react";
import Image from "next/image";
import { CommunityMember } from "./types";

const MEMBERS_DATA: CommunityMember[] = [
  {
    id: "m-1",
    name: "Cheftory226",
    username: "@cheftory226",
    avatar: "/images/community/member-cheftory226.jpg",
    joinDate: "11 Sep, 2026",
    status: "Active",
  },
  {
    id: "m-2",
    name: "Supa_byte",
    username: "@supa_byte",
    avatar: "/images/community/member-supa-byte.jpg",
    joinDate: "15 Sep, 2026",
    status: "Cancelled",
  },
  {
    id: "m-3",
    name: "Cookbook223",
    username: "@cookbook223",
    avatar: "/images/community/member-cookbook223.jpg",
    joinDate: "20 Sep, 2026",
    status: "Expiring soon",
  },
  {
    id: "m-4",
    name: "Chefjulia19",
    username: "@chefjulia19",
    avatar: "/images/community/member-chefjulia19.jpg",
    joinDate: "19 Sep, 2026",
    status: "Active",
  },
  {
    id: "m-5",
    name: "Foodfinder",
    username: "@foodfinder",
    avatar: "/images/community/member-foodfinder.jpg",
    joinDate: "22 Sep, 2026",
    status: "Cancelled",
  },
  {
    id: "m-6",
    name: "Thechef88",
    username: "@thechef88",
    avatar: "/images/community/member-thechef88.jpg",
    joinDate: "23 Sep, 2026",
    status: "Expiring soon",
  },
];

export function MembersTab() {
  const [isEmpty, setIsEmpty] = useState(true);

  return (
    <div className="w-full text-white space-y-6 pt-2">
      {/* Dev / Reviewer Toggle */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsEmpty(!isEmpty)}
          className="text-xs text-white/50 hover:text-[#FBBE15] transition-colors underline cursor-pointer"
        >
          {isEmpty ? "Switch to filled state (1,200)" : "Switch to empty state (0)"}
        </button>
      </div>

      {isEmpty ? (
        /* ================= EMPTY STATE (0 MEMBERS) ================= */
        <div className="w-full space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
            All Members (0)
          </h2>

          <div className="w-full min-h-[460px] flex flex-col items-center justify-center text-center py-12">
            {/* Exact Vector-25.svg from Figma */}
            <div className="mb-6 flex items-center justify-center">
              <svg
                width="160"
                height="160"
                viewBox="0 0 196 196"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M183.628 75.9675C180.329 72.52 176.916 68.9675 175.63 65.8438C174.44 62.9825 174.37 58.24 174.3 53.6462C174.169 45.1062 174.029 35.4287 167.3 28.7C160.571 21.9712 150.894 21.8312 142.354 21.7C137.76 21.63 133.018 21.56 130.156 20.37C127.041 19.0837 123.48 15.6712 120.032 12.3725C113.995 6.57125 107.135 0 98 0C88.865 0 82.0137 6.57125 75.9675 12.3725C72.52 15.6712 68.9675 19.0837 65.8438 20.37C63 21.56 58.24 21.63 53.6462 21.7C45.1062 21.8312 35.4287 21.9712 28.7 28.7C21.9712 35.4287 21.875 45.1062 21.7 53.6462C21.63 58.24 21.56 62.9825 20.37 65.8438C19.0837 68.9587 15.6712 72.52 12.3725 75.9675C6.57125 82.005 0 88.865 0 98C0 107.135 6.57125 113.986 12.3725 120.032C15.6712 123.48 19.0837 127.033 20.37 130.156C21.56 133.018 21.63 137.76 21.7 142.354C21.8312 150.894 21.9712 160.571 28.7 167.3C35.4287 174.029 45.1062 174.169 53.6462 174.3C58.24 174.37 62.9825 174.44 65.8438 175.63C68.9587 176.916 72.52 180.329 75.9675 183.628C82.005 189.429 88.865 196 98 196C107.135 196 113.986 189.429 120.032 183.628C123.48 180.329 127.033 176.916 130.156 175.63C133.018 174.44 137.76 174.37 142.354 174.3C150.894 174.169 160.571 174.029 167.3 167.3C174.029 160.571 174.169 150.894 174.3 142.354C174.37 137.76 174.44 133.018 175.63 130.156C176.916 127.041 180.329 123.48 183.628 120.032C189.429 113.995 196 107.135 196 98C196 88.865 189.429 82.0137 183.628 75.9675ZM98 154C95.9233 154 93.8932 153.384 92.1665 152.23C90.4398 151.077 89.094 149.437 88.2993 147.518C87.5045 145.6 87.2966 143.488 87.7018 141.452C88.1069 139.415 89.1069 137.544 90.5754 136.075C92.0438 134.607 93.9147 133.607 95.9515 133.202C97.9883 132.797 100.1 133.005 102.018 133.799C103.937 134.594 105.577 135.94 106.73 137.667C107.884 139.393 108.5 141.423 108.5 143.5C108.5 146.285 107.394 148.955 105.425 150.925C103.455 152.894 100.785 154 98 154ZM105 111.37V112C105 113.857 104.263 115.637 102.95 116.95C101.637 118.263 99.8565 119 98 119C96.1435 119 94.363 118.263 93.0503 116.95C91.7375 115.637 91 113.857 91 112V105C91 103.143 91.7375 101.363 93.0503 100.05C94.363 98.7375 96.1435 98 98 98C109.576 98 119 90.125 119 80.5C119 70.875 109.576 63 98 63C86.4238 63 77 70.875 77 80.5V84C77 85.8565 76.2625 87.637 74.9497 88.9497C73.637 90.2625 71.8565 91 70 91C68.1435 91 66.363 90.2625 65.0503 88.9497C63.7375 87.637 63 85.8565 63 84V80.5C63 63.1312 78.6975 49 98 49C117.302 49 133 63.1312 133 80.5C133 95.7075 120.96 108.439 105 111.37Z"
                  fill="#FBBE15"
                />
              </svg>
            </div>

            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "22px",
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                textAlign: "center",
                color: "#FFFFFF",
              }}
              className="m-0"
            >
              You have no active members
            </p>
          </div>
        </div>
      ) : (
        /* ================= FILLED STATE (MEMBERS TABLE) ================= */
        <div className="w-full max-w-[860px] space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
            All Members (1,200)
          </h2>

          <div className="rounded-[22px] overflow-hidden bg-[#1c1c1c] border border-white/5 shadow-2xl">
            <div className="bg-[#1f1f1f] px-6 sm:px-8 py-4">
              <div className="grid grid-cols-12 items-center text-xs sm:text-sm font-semibold text-white/90">
                <div className="col-span-5 sm:col-span-5">User name</div>
                <div className="col-span-4 sm:col-span-4 text-center sm:text-left">
                  Join Date
                </div>
                <div className="col-span-3 sm:col-span-3 text-right">
                  Membership status
                </div>
              </div>
            </div>

            <div className="bg-[#000000] px-6 sm:px-8 py-2 divide-y divide-[#1c1c1c]">
              {MEMBERS_DATA.map((member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-12 items-center py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="col-span-5 sm:col-span-5 flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full overflow-hidden bg-[#242424]">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                    <span className="truncate text-xs sm:text-sm font-medium text-white">
                      {member.name}
                    </span>
                  </div>

                  <div className="col-span-4 sm:col-span-4 text-xs sm:text-sm text-[#b0b0b0] text-center sm:text-left">
                    {member.joinDate}
                  </div>

                  <div className="col-span-3 sm:col-span-3 flex justify-end">
                    {member.status === "Active" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#102417] border border-[#22c55e]/30 px-3.5 py-1 text-[11px] sm:text-xs font-medium text-[#4ade80]">
                        <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                        Active
                      </span>
                    )}

                    {member.status === "Cancelled" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#291212] border border-[#ef4444]/30 px-3.5 py-1 text-[11px] sm:text-xs font-medium text-[#ef4444]">
                        <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                        Cancelled
                      </span>
                    )}

                    {member.status === "Expiring soon" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#291e0a] border border-[#f59e0b]/30 px-3.5 py-1 text-[11px] sm:text-xs font-medium text-[#f59e0b]">
                        <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                        Expiring soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
