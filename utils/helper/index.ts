import {BukaRestaurant} from "@/components/buka/BukaCard";

const sortDbFirstThenByDate = (items: BukaRestaurant[]): BukaRestaurant[] =>
    [...items].sort((a, b) => {
        const aIsGoogle = a.rawRestaurant?.source === "google" ? 1 : 0;
        const bIsGoogle = b.rawRestaurant?.source === "google" ? 1 : 0;
        if (aIsGoogle !== bIsGoogle) return aIsGoogle - bIsGoogle;
        const dateA = a.rawRestaurant?.updatedAt;
        const dateB = b.rawRestaurant?.updatedAt;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });


export const helper = {
    sortDbFirstThenByDate
}