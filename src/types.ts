export type Post = {
  id: string;
  title: string;
  author: string;
  image?: string;
};

export const demoPosts: Post[] = [
  { id: "1", title: "Prototype Moment", author: "@proto_ai" },
  { id: "2", title: "Symbolic Feed", author: "@neonfork" },
  { id: "3", title: "Ocean Study", author: "@superNova_2177" },
];
