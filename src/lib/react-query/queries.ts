import { INewUser, IUpdateUser } from "@/types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  createUserAccount,
  cretePost,
  deletePost,
  getCreatorsLimit,
  getInfinitePost,
  getLikedUserPosts,
  getPostById,
  getRecentPost,
  getSavedUserPosts,
  getUserById,
  getUserByLogedIn,
  getUserPosts,
  getallUsers,
  likePost,
  logoutAccount,
  savePost,
  serachPost,
  signInAccount,
  updatePost,
  updateUser,
} from "../service/api";
import { QUERY_KEYS } from "./queryKeys";


// ============================================================
// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useLogoutAccount = () => {
  return useMutation({
    mutationFn: logoutAccount,
  });
};



// ============================================================
// POST QUERIES
// ============================================================

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam = 1 } :{ pageParam?: number}) => getInfinitePost(pageParam),
    getNextPageParam: (lastPage) => {
      const { current_page, per_page, total } = lastPage.data;

      // console.log(current_page, per_page, total);

      // Hitung total halaman yang tersedia
      const totalPages = Math.ceil(total / per_page);

      // Jika halaman saat ini kurang dari total halaman, kembali halaman berikutnya
      if (current_page < totalPages) {
        return current_page + 1;
      }

      // Mengembalikan null ketika sudah mencapai akhir data
      return null;
    },
    initialPageParam: 1, // Add this line to specify the initial page param
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => serachPost(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPost,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => cretePost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPostById = (postId?: string) => {
  // console.log(postId);
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};


export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({postId}:any) => likePost(postId),
    onSuccess(data) {
      //  console.log(data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.data.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
}

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({postId}:any) => savePost(postId),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({formData, postId}: {formData:FormData; postId:any}) => updatePost({formData, postId}),
    onSuccess: (data) => {
      // console.log(data.data.datas.id);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data.data.datas.id],
      });
    },
  });
}

export const useGetUserPosts = (userId? :any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId?: any; }) =>
      deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getUserByLogedIn,
  });
};

export const useGetSavedUserPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_USER_POST],
    queryFn: () => getSavedUserPosts(),
  });
}

export const useGetLikedUserPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_USER_POST],
    queryFn: () => getLikedUserPosts(),
  });
}

export const useGetCreatorsLimit = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getCreatorsLimit(limit || 10),
  });
};

export const useGetAllUsers = (page: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_USERS, page],
    queryFn: () => getallUsers(page),
    placeholderData: keepPreviousData,
  });
};

export const useGetUserById = (userId:any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId
  });
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data:any) => {
      // console.log(data.data.id);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.data.id],
      });
    },
  });
};
