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
import { useRestaurants } from "@/lib/api/services/restaurants.hooks";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger, 
  DrawerClose 
} from "@/components/ui/drawer";
import { Search as SearchIcon } from "lucide-react";

interface UploadDetailsProps {
  file: File;
  onPost: (data: { description: string; tags: string[]; location: string; restaurantId?: string }) => void;
  onDiscard: () => void;
  isUploading?: boolean;
}

export function UploadDetails({ file, onPost, onDiscard, isUploading = false }: UploadDetailsProps) {
  const isImage = file.type.startsWith("image/");
  const [description, setDescription] = useState("");
  const videoUrl = useRef(URL.createObjectURL(file));
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // UI States
  const [showLocations, setShowLocations] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  
  // Tagging States
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<{ id: string; name: string } | null>(null);

  // Video States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Unmuted by default as requested
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("00:00");

  // Restaurant searching
  const [searchTerm, setSearchTerm] = useState("");
  const { data: restaurantsResponse, isLoading: isLoadingRestaurants } = useRestaurants({ 
    page: 1, 
    pageSize: 20,
    // Add city filter if needed, or if the hook supports search param by name
    // For now we'll use the basic fetch and maybe filter client-side if API doesn't support name search directly
  });
  const restaurantsList = restaurantsResponse?.data || [];

  // Client-side filtering as a fallback if API doesn't support 'search' parameter in getRestaurants
  const displayedRestaurants = searchTerm 
    ? restaurantsList.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : restaurantsList;

  // Mock data
  // const users = [
  //   { name: "Cody Buka", handle: "@codybuka", image: "/images/mock/user1.jpg" },
  //   { name: "Alfredo Saris", handle: "@localbuka", image: "/images/mock/user2.jpg" },
  //   { name: "Matthias Meal", handle: "@matthias", image: "/images/mock/user3.jpg" },
  // ];

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

  const handleSelectRestaurant = (restaurant: { id: string; name: string }) => {
    setSelectedRestaurant(restaurant);
    setShowUsers(false);
  };

  const handleRemoveRestaurant = () => {
    setSelectedRestaurant(null);
  };

  const handleHashtagClick = () => {
    setDescription(prev => {
      const trimmed = prev.trimEnd();
      return trimmed + (trimmed ? " #" : "#");
    });
  };

  const extractHashtags = (text: string) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(m => m.slice(1)) : [];
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
                disabled={isUploading}
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
                disabled={isUploading}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-bold transition-colors disabled:opacity-50",
                  showLocations ? "text-[#fbbe15]" : "text-[#1a1a1a]"
                )}
              >
                <MapPin size={16} />
                Add Location
              </button>
              <Drawer open={showUsers} onOpenChange={setShowUsers}>
                <DrawerTrigger asChild>
                  <button 
                    onClick={() => {
                      setShowUsers(true);
                      setShowLocations(false);
                    }}
                    disabled={isUploading}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-bold transition-colors disabled:opacity-50",
                      showUsers ? "text-[#fbbe15]" : "text-[#1a1a1a]"
                    )}
                  >
                    <Tag size={16} />
                    Mention
                  </button>
                </DrawerTrigger>
                <DrawerContent className="bg-white border-none h-[70vh] w-[40%] mx-auto">
                  <DrawerHeader className="border-b border-gray-100">
                    <DrawerTitle className="text-center font-bold text-lg">Mention</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 flex flex-col gap-4 overflow-hidden h-full">
                    {/* Search Bar */}
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input 
                        type="text"
                        placeholder="Search restaurants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#fbbe15]"
                      />
                    </div>

                    {/* Restaurants List */}
                    <div className="flex-1 overflow-y-auto space-y-2 mt-2 pb-20">
                      {isLoadingRestaurants ? (
                        <div className="flex justify-center py-10">
                          <Loader2 className="w-6 h-6 animate-spin text-[#fbbe15]" />
                        </div>
                      ) : displayedRestaurants.length > 0 ? (
                        displayedRestaurants.map((r: any) => (
                          <button 
                            key={r.id}
                            onClick={() => {
                              handleSelectRestaurant({ id: r.id, name: r.name });
                            }}
                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-colors text-left"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                              <img 
                                src={r.photos?.[0] || "/images/placeholder-restaurant.png"} 
                                alt={r.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[#1a1a1a]">{r.name}</span>
                              <span className="text-xs text-zinc-400 line-clamp-1">{r.address}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-10 text-zinc-400 text-sm">No restaurants found</div>
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              <button 
                onClick={handleHashtagClick}
                disabled={isUploading} 
                className="flex items-center gap-1.5 text-xs font-bold text-[#1a1a1a] disabled:opacity-50 cursor-pointer"
              >
                <Hash size={16} />
                Hashtags
              </button>
            </div>

            {/* Selected Tags Display */}
            {(selectedLocations.length > 0 || selectedRestaurant) && (
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
                          disabled={isUploading}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedRestaurant && (
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100">
                      <Tag size={12} className="shrink-0" />
                      <span>{selectedRestaurant.name}</span>
                      <button 
                        onClick={handleRemoveRestaurant} 
                        className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                        disabled={isUploading}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-auto space-y-3">
               <button
                onClick={() => onPost({ 
                  description, 
                  tags: extractHashtags(description), 
                  location: selectedLocations[0],
                  restaurantId: selectedRestaurant?.id
                })}
                className="w-full py-3 bg-[#fbbe15] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#e5ac10] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(!description && !file) || isUploading}
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Post"}
              </button>
              <button
                onClick={onDiscard}
                disabled={isUploading}
                className="w-full py-3 bg-[#e4e4e7] text-[#1a1a1a] font-bold rounded-xl hover:bg-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>

          {/* Right Column: Video Preview */}
          <div className="w-full lg:w-[320px] bg-black rounded-2xl overflow-hidden relative aspect-9/16 lg:aspect-auto h-[500px] group">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
            
            {isImage ? (
              <img 
                src={videoUrl.current} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
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
            )}

            {/* Overlay UI */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4 z-10 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-bold text-sm">You</div>
              </div>
              <div className="text-xs opacity-80 mb-3 line-clamp-2">
                {description || "Description preview..."}
              </div>
              
              {/* Progress Bar & Stats (Hide for images) */}
              {!isImage && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
