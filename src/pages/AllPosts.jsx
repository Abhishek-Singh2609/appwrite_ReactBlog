// // import React, {useState, useEffect} from 'react'
// // import { Container, PostCard } from '../components'
// // import appwriteService from "../appwrite/config";

// // function AllPosts() {
// //     const [posts, setPosts] = useState([])
// //     useEffect(() => {}, [])
// //     appwriteService.getPosts([]).then((posts) => {
// //         if (posts) {
// //             setPosts(posts.documents)
// //         }
// //     })
// //   return (
// //     <div className='w-full py-8'>
// //         <Container>
// //             <div className='flex flex-wrap'>
// //                 {posts.map((post) => (
// //                     <div key={post.$id} className='p-2 w-1/4'>
// //                         <PostCard {...post} />
// //                     </div>
// //                 ))}
// //             </div>
// //             </Container>
// //     </div>
// //   )
// // }

// // export default AllPosts

// import React, { useState, useEffect } from "react";
// import { Container, PostCard } from "../components";
// import appwriteService from "../appwrite/config";

// function AllPosts() {
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Fetch posts when the component mounts
//         const fetchPosts = async () => {
//             try {
//                 const response = await appwriteService.getPosts();
//                 if (response) {
//                     setPosts(response.documents); // Ensure posts are properly set
//                 }
//             } catch (err) {
//                 setError("Failed to load posts. Please try again later.");
//                 console.error("Error fetching posts:", err);
//             } finally {
//                 setLoading(false); // Stop the loading spinner
//             }
//         };

//         fetchPosts();
//     }, []); // Dependency array ensures this runs only once

//     if (loading) {
//         return <p className="text-center py-8">Loading posts...</p>;
//     }

//     if (error) {
//         return <p className="text-center text-red-500 py-8">{error}</p>;
//     }

//     if (posts.length === 0) {
//         return <p className="text-center py-8">No posts available at the moment.</p>;
//     }

//     return (
//         <div className="w-full py-8">
//             <Container>
//                 <div className="flex flex-wrap">
//                     {posts.map((post) => (
//                         <div key={post.$id} className="p-2 w-1/4">
//                             <PostCard {...post} />
//                         </div>
//                     ))}
//                 </div>
//             </Container>
//         </div>
//     );
// }

// export default AllPosts;


import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await appwriteService.getPosts();
            if (response) {
                setPosts(response.documents);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {posts.map((post) => (
                        <div key={post.$id} className="p-2 w-1/4">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
