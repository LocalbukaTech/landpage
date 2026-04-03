"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useMe, useUpdateMe } from "@/lib/api/services/auth.hooks";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api/client";

export function ProfileDetails() {
    const { toast } = useToast();
    const { requireAuth, isAuthenticated } = useRequireAuth();
    const { user, updateUser } = useAuth();
    const { data: meResponse, isLoading } = useMe();
    const updateMeMutation = useUpdateMe();

    // Extract user data from API response
    const meData = (meResponse as any)?.data?.data || (meResponse as any)?.data || null;
    const apiUser = meData || user;

    // Split fullName into first/last for the form
    const nameParts = (apiUser?.fullName || "").split(" ");
    const initialFirst = nameParts[0] || "";
    const initialLast = nameParts.slice(1).join(" ") || "";

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        avatar: "",

    });

    const [profileImage, setProfileImage] = useState("/images/profile-pic.png");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Populate form when user data loads
    useEffect(() => {
        if (apiUser) {
            const parts = (apiUser.fullName || "").split(" ");
            setFormData({
                firstName: parts[0] || "",
                lastName: parts.slice(1).join(" ") || "",
                email: apiUser.email || "",
                avatar: apiUser.avatar || "",
            });
            if (apiUser.image_url || apiUser.avatar) {
                setProfileImage(apiUser.image_url || apiUser.avatar);
            }
        }
    }, [apiUser?.fullName, apiUser?.email]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Optimistically show the image
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);

            setIsUploading(true);
            try {
                const uploadData = new FormData();
                uploadData.append("Photo", file); // standard key for file uploads

                const response = await api.post("images/upload", uploadData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const uploadedUrl = (response as any)?.data?.url || (response as any)?.url || (response as any)?.data;
                if (typeof uploadedUrl === "string") {
                    setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
                    setProfileImage(uploadedUrl); // Update with the real URL
                } else if ((response as any)?.data) {
                    setFormData((prev) => ({ ...prev, avatar: (response as any).data }));
                }
                
                toast({
                    title: "Image Uploaded",
                    description: "Your profile picture was uploaded successfully.",
                    variant: "success",
                });
            } catch (error) {
                toast({
                    title: "Upload Failed",
                    description: "Failed to upload profile picture. Please try again.",
                    variant: "destructive",
                });
                // Revert to original user image if upload failed
                if (apiUser?.image_url || apiUser?.avatar) {
                    setProfileImage(apiUser.image_url || apiUser.avatar);
                } else {
                    setProfileImage("/images/profile-pic.png");
                }
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log('hhhh')
        requireAuth(() => {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            updateMeMutation.mutate(
                { fullName, avatar: formData.avatar },
                {
                    onSuccess: (response: any) => {
                        const updatedUser = response?.data?.data || response?.data;
                        if (updatedUser) updateUser(updatedUser);
                        toast({
                            title: "Profile Updated",
                            description: "Your profile has been saved successfully.",
                            variant: "success",
                        });
                    },
                    onError: (err: any) => {
                        toast({
                            title: "Update Failed",
                            description: err?.response?.data?.message || "Unable to update profile. Please try again.",
                            variant: "destructive",
                        });
                    },
                }
            );
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="w-full px-4 lg:pl-[56px] lg:pr-12 pt-8 lg:pt-0 flex flex-col items-center justify-center h-64">
                <p className="text-zinc-400 text-sm">Sign in to view your profile.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full px-4 lg:pl-[56px] lg:pr-12 pt-8 lg:pt-0 flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-[#fbbe15]" />
            </div>
        );
    }

    return (
        <div className="w-full px-4 lg:pl-[56px] lg:pr-12 pt-8 lg:pt-0 flex flex-col h-full">
            {/* Profile Picture Section */}
            <div className="mb-[40px] relative w-max">
                <div className="relative h-[70px] w-[70px]">
                    <Image
                        src={profileImage}
                        alt="Profile"
                        fill
                        className="object-cover rounded-[10px]"
                    />
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    onClick={handleImageClick}
                    className="absolute -bottom-2 -right-2 bg-white rounded-full p-[8px] shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Change profile picture"
                >
                    <Camera className="w-[18px] h-[18px] text-black" />
                </button>
            </div>

            {/* Form Section */}
            <div className="w-full max-w-[380px] space-y-[24px]">
                <InputField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                />

                <InputField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                />

                <InputField
                    name="email"
                    value={formData.email}
                    disabled
                    type="email"
                />
            </div>

            {/* Save Button */}
            <div className="mt-12 flex justify-start lg:justify-end w-full">
                <Button
                    onClick={handleSave}
                    disabled={updateMeMutation.isPending || isUploading}
                    className="w-full max-w-[380px] bg-[#F5B400] hover:bg-[#D99F00] text-black font-semibold text-[14px] h-[52px] rounded-[10px] shadow-none border-none disabled:opacity-50"
                >
                    {updateMeMutation.isPending ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </span>
                    ) : isUploading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading Image...
                        </span>
                    ) : (
                        "Save"
                    )}
                </Button>
            </div>
        </div>
    );
}
