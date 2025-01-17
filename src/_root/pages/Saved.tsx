import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetSavedUserPosts } from "@/lib/react-query/queries";

const Saved = () => {

  const { data:savedUser } = useGetSavedUserPosts();

  // console.log(savedUser);

  const savePosts = savedUser?.data
  .map((savePost: any) => ({
    ...savePost.post,
    user: {
      ...savePost.user,
    },
  }))
    .reverse();

  // console.log(savePosts);

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>
      {!savePosts ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList key={1} posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
