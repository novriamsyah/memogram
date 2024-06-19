import {
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queries";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type PostStatsProps = {
  post: any;
  userId: any;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();  //Get Pathname Url

  //Create List of Likes dari post from id user EX: [id1, id2, id3]
  const likesList = post?.likes?.map(
    (user: { user_id: string }) => user.user_id
  );

  //   console.log(likesList);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();

  const { data: currentUser } = useGetCurrentUser();

//   console.log(currentUser);

  useEffect(() => {

    // Mencoba mengakses properti 'saves' dari objek 'currentUser'. '?' digunakan untuk menghindari error jika 'currentUser' belum terdefinisi.
    const savedPostRecord = currentUser?.data.saves.find(
        // Melakukan pencarian dalam array 'saves' untuk menemukan record dimana 'post_id' sama dengan id dari post yang sedang dilihat.
      (record:any) => record.post_id === post.id 
    );

    // Mengatur state 'isSaved' menjadi true jika 'savedPostRecord' ditemukan (truthy), yang berarti post sudah disimpan oleh user.
    setIsSaved(!!savedPostRecord);
  }, [currentUser, post]); // Daftar ketergantungan untuk useEffect, menjalankan useEffect ini lagi jika 'currentUser' atau 'post' berubah.

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation(); // Menghentikan event untuk tidak dibawa ke tingkat yang lebih tinggi dari DOM (menghindari event bubbling).

    const postId = post.id;

    // console.log(postId);

    if (!postId) {
      return;
    }

    let likesArray = [...likes]; // Membuat salinan dari state likes untuk dimodifikasi.


    if (likesArray.includes(userId)) {
        // Jika array sudah termasuk userId, berarti user sudah menyukai post tersebut dan sekarang klik berfungsi untuk 'unlike'.
      likesArray = likesArray.filter((id) => id !== userId); // Menghapus userId dari array.
    } else {
        // Jika userId belum ada di array, klik berfungsi untuk menambahkan 'like'.
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId });
  };

  const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {

    e.stopPropagation();

    const postId = post.id; // Ensure this is the correct field
    if (!postId) {
      return;
    }

    setIsSaved(!isSaved);
    savePost({ postId }); // Pass the postId to the mutation

  }

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";


  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            likes.includes(userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />

        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
};

export default PostStats;
