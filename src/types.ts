// src/types.ts

export interface Post {
  id: number | string;

  // Core properties
  author?: string;
  title?: string;
  image?: string;

  // Add these two optional properties to fix the build error
  space?: string;   // e.g. "superNova_2177"
  avatar?: string;  // URL for the author's avatar
}
