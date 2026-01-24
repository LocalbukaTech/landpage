/**
 * Blog Draft Management
 * 
 * Handles saving and retrieving blog drafts from localStorage
 */

const DRAFTS_STORAGE_KEY = 'localbuka_blog_drafts';

export interface BlogDraft {
  id: string;
  title: string;
  content: string;
  category: string;
  coverImage: string | null; // Base64 data URL
  updatedAt: string;
}

/**
 * Generate a unique ID for a new draft
 */
export const generateDraftId = (): string => {
  return `draft_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get all drafts from localStorage
 */
export const getDrafts = (): BlogDraft[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as BlogDraft[];
  } catch {
    console.error('Failed to parse blog drafts from localStorage');
    return [];
  }
};

/**
 * Get a single draft by ID
 */
export const getDraft = (id: string): BlogDraft | null => {
  const drafts = getDrafts();
  return drafts.find((d) => d.id === id) || null;
};

/**
 * Save or update a draft
 */
export const saveDraft = (draft: BlogDraft): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const drafts = getDrafts();
    const existingIndex = drafts.findIndex((d) => d.id === draft.id);
    
    // Update lastModified time
    const updatedDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    
    if (existingIndex >= 0) {
      // Update existing draft
      drafts[existingIndex] = updatedDraft;
    } else {
      // Add new draft
      drafts.push(updatedDraft);
    }
    
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Failed to save blog draft:', error);
  }
};

/**
 * Delete a draft by ID
 */
export const deleteDraft = (id: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const drafts = getDrafts();
    const filtered = drafts.filter((d) => d.id !== id);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete blog draft:', error);
  }
};

/**
 * Get drafts count
 */
export const getDraftsCount = (): number => {
  return getDrafts().length;
};

/**
 * Convert base64 data URL to File
 */
export const dataUrlToFile = async (
  dataUrl: string,
  filename: string = 'image.jpg'
): Promise<File> => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
};
