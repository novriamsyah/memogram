import { INewUser } from "@/types";
import requestProcessor from "./request";


// ============================================================
// AUTH
// ============================================================
export const createUserAccount = async (user: INewUser) => {
  return await requestProcessor("POST", "/register", user);
};

export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const response = await requestProcessor("POST", "/login", user);
    const token = response.data.datas.token;
    localStorage.setItem("token", token); // Simpan token di localStorage
    return response;
  } catch (error) {
    throw new Error("Login failed"); // Anda mungkin ingin menangani error login di sini
  }
};

export const logoutAccount = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  localStorage.removeItem("token"); // Hapus token dari localStorage saat logout
  return requestProcessor("POST", "/logout", null, token);
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found"); // Tangani jika token tidak ada
  }
  return requestProcessor("GET", "/me", null, token); // Sertakan token dalam permintaan
};

// ============================================================
// POSTS
// ============================================================

export const cretePost = async (post: FormData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    return requestProcessor("POST", "/post/create", post, token, true);
  } catch (error) {
    console.log(error);
  }
};

export async function getRecentPost() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  
  return requestProcessor("GET", "/posts", null, token);
}

export async function likePost(postId:any) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor('POST', `/post/${postId}/like`, null, token);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function savePost(postId:any) {
  try {
    const token = localStorage.getItem("token");
    if(!token) {
      throw new Error("Token not found");
    }

    return requestProcessor('POST', `/post/${postId}/save`, null, token);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getPostById = (postId:any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("GET", `/post/${postId}/edit`, null, token);
  } catch (error) {
    console.log(error);
  }
}

export const updatePost = async ({formData, postId} : { formData:FormData, postId:any }) => {
  // for (let pair of formData.entries()) {
  //   console.log(pair[0]+ ', ' + pair[1]); 
  // }
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("POST", `/post/${postId}/update`, formData, token, true);
  } catch (error) {
    console.log(error);
  }
}

export const getUserPosts = async (userId:any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("GET", `/user/${userId}/posts`, null, token);
  } catch (error) {
    console.log(error);
  }
}

export const getInfinitePost = async (pageParam:any) => {
  try {
    // console.log(pageParam);
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("GET", `/posts/infinite?page=${pageParam}`, null, token);

  } catch (error) {
    console.log(error);
  }
}

export const serachPost = async (query:string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("GET", `/posts/search?query=${query}`, null, token);
  } catch (error) {
    console.log(error);
  }
}

export const getCreatorsLimit = async (limit:number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("GET", `/users/creator?limit=${limit}`, null, token);
  } catch (error) {
    console.log(error);
  }
}

export const getSavedUserPosts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("GET", `user/posts/save`, null, token);
  } catch (error) {
    console.log(error);
  }
}

export const getLikedUserPosts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("GET", `user/posts/like`, null, token);
  } catch (error) {
    console.log(error);
  }
}

export const deletePost = async (postId:any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("DELETE", `/posts/${postId}/delete`, null, token);
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// USER
// ============================================================

export const getallUsers = async (page = 1) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("GET", `/users?page=${page}`, null, token);
  } catch (error) {
    console.log(error);
  }
}

export const getUserByLogedIn = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found"); // Tangani jika token tidak ada
  }
  return requestProcessor("GET", "/user", null, token); // Sertakan token dalam permintaan
};

export const getUserById = (userId:any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("GET", `/user/${userId}`, null, token);
  } catch (error) {
    console.log(error);
  }
}

export const updateUser = async (user:any) => {
  // console.log(user);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return requestProcessor("POST", `/users/${user.id}/profile`, user, token, true);
  } catch (error) {
    console.log(error);
  }
}




