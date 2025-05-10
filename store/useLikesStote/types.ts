export interface LikeState {
  likedItems: number[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;

  fetchLikedItems: (userId: string) => void;
  toggleLike: (userId: string, itemId: number) => void;
  isLiked: (itemId: number) => boolean;
}