import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploder";
import { PostValidation } from "@/lib/validation";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import Loader from "../shared/Loader";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";
import { parseTags } from "@/lib/utils";

type PostFormProps = {
  post?: any;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post.data[0].caption : "",
      image: [],
      location: post ? post.data[0].location : "",
      tags: post ? parseTags(post.data[0].tags).join(",") : "",
    },
  });

  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePostMut, isPending: isLoadingUpdate } =
    useUpdatePost();

  const handleSubmit = async (values: z.infer<typeof PostValidation>) => {
    if (post && action === "Update") {
      try {

        const postId = post.data[0].id.toString();

        const formData = new FormData();
        // formData.append("postId", post.data[0].id.toString());
        formData.append("caption", values.caption);
        formData.append("location", values.location);
        formData.append("tags", values.tags);
        if (values.image.length > 0) {
          formData.append('image', values.image[0]);
        }
        formData.append("userId", user.id.toString());

        const updatePost = await updatePostMut({formData, postId});

        if (!updatePost) {
          toast({
            title: `Update post failed. Please try again.`,
          });
        } else {
          navigate(`/posts/${post.data[0].id}`);
        }
      } catch (error) {
        toast({
          title: `Create or update post failed. Please try again.`,
        });
      }
    } else {
      // console.log('tes2')
      try {
        const formData = new FormData();
        formData.append("caption", values.caption);
        formData.append("location", values.location);
        formData.append("tags", values.tags);
        formData.append("image", values.image[0]); // Assumes single file upload
        formData.append("userId", user.id.toString()); // Ensure userId is a string

        const createdPost = await createPost(formData);

        if (!createdPost) {
          toast({
            title: `Create post failed. Please try again.`,
          });
        } else {
          navigate("/");
        }
      } catch (error) {
        toast({
          title: `Create or update post failed. Please try again.`,
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.data[0].image_url}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input className="shad-input" type="text" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (Separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  className="shad-input"
                  type="text"
                  placeholder="tag1, tag2, tag3"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {isLoadingCreate || (isLoadingUpdate && <Loader />)} {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
