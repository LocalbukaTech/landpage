export interface SocialUser {
id: string;
name: string;
username: string;
avatar: string;
  // Standardized to match Figma casing exactly
actionLabel: "Follow" | "Follow back" | "Unfollow"; 
}