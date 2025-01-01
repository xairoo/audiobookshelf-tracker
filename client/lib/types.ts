export type User = {
  id: number;
  username: string;
};

export type History = {
  userId: string;
  itemId: string;
  episodeId: string | null;
  type: string;
  author: string;
  title: string;
  subtitle: string | null;
  progress: number;
  updatedAt: string;
};
