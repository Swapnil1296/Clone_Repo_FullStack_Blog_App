import { Alert, Button, Modal, Spinner, Textarea } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comments from "./Comments";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { SessionExpired } from "./../utils/Alert";
import { signoutSuccess } from "../redux/user/userSlice";
import DraftEditor from "./Draft";

const CommentSection = ({ postId, location }) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [commentOnPosts, setCommnetOnPost] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useMemo(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setCommnetOnPost(data);
        }
        if (!res.ok) {
          if (res.status === 401) {
            SessionExpired().then(() => {
              dispatch(signoutSuccess());
              navigate("/sign-in", { replace: true });
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId: postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();

      setLoading(false);
      if (res.ok) {
        setComment("");
        setError(null);
        setCommnetOnPost([data, ...commentOnPosts]);
      }
      if (!res.ok) {
        if (res.status === 401) {
          SessionExpired().then(() => {
            dispatch(signoutSuccess());
            navigate("/sign-in", { replace: true });
          });
        }
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setCommnetOnPost(
          commentOnPosts.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
      if (!res.ok) {
        if (res.status === 401) {
          SessionExpired().then(() => {
            dispatch(signoutSuccess());
            navigate("/sign-in", { replace: true });
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleEdit = async (comment, editedContent) => {
    setCommnetOnPost(
      commentOnPosts.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setCommnetOnPost(
          commentOnPosts.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );
  //handle unsaved comments
  const draftKye = "draftContent";
  const handleCommentChange = (event) => {
    const draftData = {
      value: event.target.value,
      postId: postId,
    };
    setComment(event.target.value);
    localStorage.setItem(`${draftKye}_${postId}`, JSON.stringify(draftData));
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed In As :</p>
          <img
            src={currentUser.profilePicture}
            alt=""
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add your comment here.."
            rows={3}
            maxLength={200}
            onChange={handleCommentChange}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} Character are remaining
            </p>
            <Button type="submit" outline gradientDuoTone="purpleToPink">
              Submit
            </Button>
          </div>
          {error && <Alert color="failure">{error}</Alert>}
        </form>
      )}
      {commentOnPosts.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1  f">
            <p className="font-bold">Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-full bg-slate-100">
              <p>{commentOnPosts.length}</p>
            </div>
          </div>
          {commentOnPosts.map((comment) => (
            <Comments
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}

      <DraftEditor
        comment={comment}
        location={location}
        setComment={setComment}
        postId={postId}
        draftKye={draftKye}
      />
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CommentSection;
