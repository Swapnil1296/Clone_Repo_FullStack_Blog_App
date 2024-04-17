import { Button, Modal, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import TextToSpeech from "../TextToSpeech/TextToSpeech";

const PostPage = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(null);
  const [erorr, setError] = useState(false);
  const [recentPost, setRecentPost] = useState(null);
  const [currentPost, setCurrentPost] = useState(post);
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  console.log("postPage", location.pathname);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        console.log(data.posts[0]._id);

        if (!res.ok) {
          if (res.status === 401) {
            SessionExpired().then(() => {
              dispatch(signoutSuccess());
              navigate("/sign-in", { replace: true });
            });
            setError(true);
            setLoading(false);
          }
        }
        if (res.ok) {
          setPost(data.posts[0]);

          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=3");
        const data = await res.json();

        if (res.ok) {
          setRecentPost(data.posts);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <Button className="rounded-full w-20" onClick={() => setOpenModal(true)}>
        Text to Speech
      </Button>
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4x">
        {post && post.title}
      </h1>
      {/* <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link> */}
      <div className="flex justify-center items-center gap-1 flex-wrap">
        {post.category?.map((innerArray, index) => (
          <Link
            to={`/search?category=${post && post.category}`}
            className="self-center mt-1"
            key={index}
          >
            {Array.isArray(innerArray) ? (
              innerArray.map((item, innerIndex) => (
                <Button color="gray" pill size="xs" key={innerIndex}>
                  {item}
                </Button>
              ))
            ) : (
              <Button color="gray" pill size="xs">
                {innerArray}
              </Button>
            )}
          </Link>
        ))}
      </div>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} location={location.pathname} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPost &&
            recentPost.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
      <div>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Terms of Service</Modal.Header>
          <Modal.Body>
            <TextToSpeech text={post.content} />
          </Modal.Body>
        </Modal>
      </div>
    </main>
  );
};

export default PostPage;
