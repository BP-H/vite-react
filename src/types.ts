// Minimal app-wide types that match the feed components

export interface Post {
  id: number | string;

  // UI text
  author?: string;   // e.g. "@proto_ai"
  title?: string;    // e.g. "Ocean study"

  // media
  image?: string;    // image URL

  // extra meta used in top bar (optional)
  space?: string;    // e.g. "superNova_2177"
  avatar?: string;   // avatar URL (can be data: url or http)
}
