import { INewUser } from "@/types";
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
  getCreatorsLimit,
  getInfinitePost,
  getPostById,
  getRecentPost,
  getSavedUserPosts,
  getUserByLogedIn,
  getUserPosts,
  getallUsers,
  likePost,
  logoutAccount,
  savePost,
  serachPost,
  signInAccount,
  updatePost,
} from "../service/api";
import { QUERY_KEYS } from "./queryKeys";

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

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPost,
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({postId}:any) => likePost(postId),
    onSuccess() {
      //  console.log(variable);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
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

export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

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
