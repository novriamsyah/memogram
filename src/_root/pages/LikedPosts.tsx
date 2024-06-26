
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queries";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  const likePosts = currentUser.data?.likes
  .map((likePost: any) => ({
    ...likePost.post,
    user: {
      ...likePost.user,
    },
  }))
    .reverse();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser.data.likes.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={likePosts} showStats={false} />
    </>
  );
};

export default LikedPosts;