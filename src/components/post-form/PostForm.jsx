import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });
                // console.log(userData.$id);
                

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}

// import React, { useCallback } from "react";
// import { useForm } from "react-hook-form";
// import { Button, Input, RTE, Select } from "..";
// import appwriteService from "../../appwrite/config";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// export default function PostForm({ post }) {
//     const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
//         defaultValues: {
//             title: post?.title || "",
//             slug: post?.$id || "",
//             content: post?.content || "",
//             status: post?.status || "active",
//         },
//     });

//     const navigate = useNavigate();
//     const userData = useSelector((state) => state.auth.userData);

//     const submit = async (data) => {
//         try {
//             const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
    
//             const postData = {
//                 title: data.title || "", // Default to empty string if missing
//                 content: data.content || "", // Default to empty string if missing
//                 featuredImage: file ? file.$id : "",
//                 status: data.status || "inactive", // Default to inactive
//                 userid: userData?.$id || "", // Ensure userData exists
//             };
    
//             console.log("Post Data Before Create:", postData);
    
//             const dbPost = await appwriteService.createPost(postData);
    
//             if (dbPost) {
//                 navigate(`/post/${dbPost.$id}`);
//             }
//         } catch (error) {
//             console.error("Failed to create post:", error.message);
//         }
//     };
        

//     const slugTransform = useCallback((value) => {
//         if (value && typeof value === "string") {
//             return value
//                 .trim()
//                 .toLowerCase()
//                 .replace(/[^a-zA-Z\d\s]+/g, "-")
//                 .replace(/\s+/g, "-");
//         }
//         return "";
//     }, []);

//     React.useEffect(() => {
//         const subscription = watch((value, { name }) => {
//             if (name === "title") {
//                 setValue("slug", slugTransform(value.title), { shouldValidate: true });
//             }
//         });

//         return () => subscription.unsubscribe();
//     }, [watch, slugTransform, setValue]);

//     return (
//         <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
//             <div className="w-2/3 px-2">
//                 <Input
//                     label="Title :"
//                     placeholder="Title"
//                     className="mb-4"
//                     {...register("title", { required: true })}
//                 />
//                 <Input
//                     label="Slug :"
//                     placeholder="Slug"
//                     className="mb-4"
//                     {...register("slug", { required: true })}
//                     onInput={(e) => {
//                         setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
//                     }}
//                 />
//                 <RTE
//                     label="Content :"
//                     name="content"
//                     control={control}
//                     defaultValue={getValues("content")}
//                 />
//             </div>
//             <div className="w-1/3 px-2">
//                 <Input
//                     label="Featured Image :"
//                     type="file"
//                     className="mb-4"
//                     accept="image/png, image/jpg, image/jpeg, image/gif"
//                     {...register("image", { required: !post })}
//                 />
//                 {post && post.featuredImage && (
//                     <div className="w-full mb-4">
//                         <img
//                             src={appwriteService.getFilePreview(post.featuredImage)}
//                             alt={post.title}
//                             className="rounded-lg"
//                         />
//                     </div>
//                 )}
//                 <Select
//                     options={["active", "inactive"]}
//                     label="Status"
//                     className="mb-4"
//                     {...register("status", { required: true })}
//                 />
//                 <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
//                     {post ? "Update" : "Submit"}
//                 </Button>
//             </div>
//         </form>
//     );
// }

// import React, { useState } from 'react';
// import appwriteService from '../../appwrite/config';

// function PostForm() {
//     const [title, setTitle] = useState("");
//     const [slug, setSlug] = useState("");
//     const [content, setContent] = useState("");
//     const [featuredImage, setFeaturedImage] = useState(null);
//     const [status, setStatus] = useState("active");
//     const [userid, setUserid] = useState(""); // Assuming you get the userId from logged-in user

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Validate the form fields
//         if (!title || !slug || !content || !featuredImage || !userid) {
//             alert("Please fill all the fields.");
//             return;
//         }

//         // Call the createPost function to add the post
//         const postData = {
//             title,
//             slug,
//             content,
//             featuredImage,
//             status,
//             userid,
//         };

//         try {
//             const response = await appwriteService.createPost(postData);
//             if (response) {
//                 alert("Post created successfully!");
//             }
//         } catch (error) {
//             console.log("Error creating post:", error);
//             alert("Failed to create post.");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label>Title:</label>
//                 <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                 />
//             </div>
//             <div>
//                 <label>Slug:</label>
//                 <input
//                     type="text"
//                     value={slug}
//                     onChange={(e) => setSlug(e.target.value)}
//                 />
//             </div>
//             <div>
//                 <label>Content:</label>
//                 <textarea
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                 />
//             </div>
//             <div>
//                 <label>Featured Image:</label>
//                 <input
//                     type="file"
//                     onChange={(e) => setFeaturedImage(e.target.files[0])}
//                 />
//             </div>
//             <div>
//                 <label>Status:</label>
//                 <select
//                     value={status}
//                     onChange={(e) => setStatus(e.target.value)}
//                 >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                 </select>
//             </div>
//             <div>
//                 <label>User ID:</label>
//                 <input
//                     type="text"
//                     value={userid}
//                     onChange={(e) => setUserid(e.target.value)}
//                     placeholder="Enter User ID"
//                 />
//             </div>
//             <button type="submit">Create Post</button>
//         </form>
//     );
// }

// export default PostForm;
