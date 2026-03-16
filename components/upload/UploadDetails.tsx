"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MapPin, 
  Tag, 
  Hash, 
  Volume2, 
  VolumeX,
  MoreVertical, 
  Loader2,
  X,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDetailsProps {
  file: File;
  onPost: (data: { description: string }) => void;
  onDiscard: () => void;
}

export function UploadDetails({ file, onPost, onDiscard }: UploadDetailsProps) {
  const [description, setDescription] = useState("");
  const videoUrl = useRef(URL.createObjectURL(file));
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // UI States
  const [showLocations, setShowLocations] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  
  // Tagging States
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [taggedUsers, setTaggedUsers] = useState<{name: string, handle: string}[]>([]);

  // Video States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Unmuted by default as requested
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("00:00");

  // Mock data
  const users = [
    { name: "Alfredo Saris", handle: "@localbuka", image: "/images/mock/user1.jpg" },
    { name: "Alfredo Saris", handle: "@localbuka", image: "/images/mock/user2.jpg" },
    { name: "Alfredo Saris", handle: "@localbuka", image: "/images/mock/user3.jpg" },
  ];

  const locations = [
    { name: "Ikeja, Lagos" },
    { name: "Benin City, Edo", address: "Ekehuan road, Benin" },
    { name: "Island, Lagos", address: "Lekki, Lagos" },
    { name: "Island, Lagos", address: "Lekki, Lagos" },
  ];

  // Video Event Handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
      
      // Format time
      const minutes = Math.floor(current / 60);
      const seconds = Math.floor(current % 60);
      setDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleAddLocation = (locName: string) => {
    if (!selectedLocations.includes(locName)) {
      setSelectedLocations([...selectedLocations, locName]);
    }
    setShowLocations(false);
  };

  const handleRemoveLocation = (locName: string) => {
    setSelectedLocations(selectedLocations.filter(l => l !== locName));
  };

  const handleTagUser = (user: {name: string, handle: string}) => {
    if (!taggedUsers.some(u => u.handle === user.handle)) {
      setTaggedUsers([...taggedUsers, user]);
    }
    setShowUsers(false);
  };

  const handleRemoveUser = (handle: string) => {
    setTaggedUsers(taggedUsers.filter(u => u.handle !== handle));
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto">

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Card */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form */}
          <div className="flex-1 flex flex-col relative">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Description</h2>
            
            <div className="relative mb-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setTimeout(() => setInputFocus(false), 200)}
                placeholder="What's happening?"
                maxLength={4000}
                className="w-full h-48 bg-[#f4f4f5] rounded-xl p-4 resize-none border-none focus:ring-2 focus:ring-[#fbbe15] focus:outline-none placeholder:text-zinc-400 text-zinc-800"
              />
              <span className="absolute bottom-4 right-4 text-xs text-zinc-400">
                {description.length}/4000
              </span>
            </div>

            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => {
                  setShowLocations(!showLocations);
                  setShowUsers(false);
                }}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-bold transition-colors",
                  showLocations ? "text-[#fbbe15]" : "text-[#1a1a1a]"
                )}
              >
                <MapPin size={16} />
                Add Location
              </button>
              <button 
                onClick={() => {
                  setShowUsers(!showUsers);
                  setShowLocations(false);
                }}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-bold transition-colors",
                  showUsers ? "text-[#fbbe15]" : "text-[#1a1a1a]"
                )}
              >
                <Tag size={16} />
                Add @Tag
              </button>
              <button className="flex items-center gap-1.5 text-xs font-bold text-[#1a1a1a]">
                <Hash size={16} />
                Hashtags
              </button>
            </div>

            {/* Selected Tags Display */}
            {(selectedLocations.length > 0 || taggedUsers.length > 0) && (
              <div className="flex flex-col gap-3 mb-6">
                
                {selectedLocations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedLocations.map(loc => (
                      <div key={loc} className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-xs font-medium border border-orange-100">
                        <MapPin size={12} className="shrink-0" />
                        <span>{loc}</span>
                        <button 
                          onClick={() => handleRemoveLocation(loc)} 
                          className="ml-1 hover:bg-orange-100 rounded-full p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {taggedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {taggedUsers.map(user => (
                      <div key={user.handle} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100">
                        <UserIcon size={12} className="shrink-0" />
                        <span>{user.name}</span>
                        <button 
                          onClick={() => handleRemoveUser(user.handle)} 
                          className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-auto space-y-3">
              <button
                onClick={() => onPost({ description })}
                className="w-full py-3 bg-[#fbbe15] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#e5ac10] transition-colors"
                disabled={!description && !file}
              >
                Post
              </button>
              <button
                onClick={onDiscard}
                className="w-full py-3 bg-[#e4e4e7] text-[#1a1a1a] font-bold rounded-xl hover:bg-zinc-300 transition-colors"
              >
                Discard
              </button>
            </div>

            {/* Dropdowns positioned absolutely within the column */}
            {showLocations && (
               <div className="absolute top-[280px] left-0 z-20 w-64 bg-white border border-[#fbbe15] rounded-xl p-4 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-[#1a1a1a] text-sm">Locations</h3>
                  <button onClick={() => setShowLocations(false)} className="text-zinc-400 hover:text-zinc-600">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {locations.map((loc, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAddLocation(loc.name)}
                      className="w-full text-left flex flex-col p-2 rounded hover:bg-zinc-50 transition-colors"
                    >
                      <span className="text-xs font-bold text-[#1a1a1a]">{loc.name}</span>
                      {loc.address && (
                        <span className="text-[10px] text-zinc-500">{loc.address}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showUsers && (
               <div className="absolute top-[280px] left-28 z-20 w-64 bg-white border border-[#fbbe15] rounded-xl p-4 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-[#1a1a1a] text-sm">Friends</h3>
                  <button onClick={() => setShowUsers(false)} className="text-zinc-400 hover:text-zinc-600">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                   {users.map((user, i) => (
                     <button 
                       key={i} 
                       onClick={() => handleTagUser(user)}
                       className="w-full text-left flex items-center gap-3 p-2 rounded hover:bg-zinc-50 transition-colors"
                     >
                       <div className="w-8 h-8 bg-zinc-200 rounded-full shrink-0" />
                       <div className="flex flex-col overflow-hidden">
                         <span className="text-xs font-bold text-[#1a1a1a] truncate">{user.name}</span>
                         <span className="text-[10px] text-zinc-400 truncate">{user.handle}</span>
                       </div>
                     </button>
                   ))}
                 </div>
              </div>
            )}
          </div>

          {/* Right Column: Video Preview */}
          <div className="w-full lg:w-[320px] bg-black rounded-2xl overflow-hidden relative aspect-9/16 lg:aspect-auto h-[500px] group">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
            
            <video
              ref={videoRef}
              src={videoUrl.current}
              className="w-full h-full object-cover"
              loop
              autoPlay
              muted={isMuted} // Controlled by state
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              onLoadedData={() => setIsLoading(false)}
            />

            {/* Overlay UI */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4 z-10 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-bold text-sm">You</div>
              </div>
              <div className="text-xs opacity-80 mb-3 line-clamp-2">
                {description || "Description preview..."}
              </div>
              
              {/* Progress Bar */}
              <div className="h-1 bg-white/30 rounded-full overflow-hidden mb-2">
                 <div 
                   className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                   style={{ width: `${progress}%` }}
                 />
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span>{duration}</span>
                <div className="flex gap-2">
                   <button 
                     onClick={toggleMute}
                     className="p-1 hover:bg-white/10 rounded-full transition-colors"
                   >
                     {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                   </button>
                   <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                     <MoreVertical size={16} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
