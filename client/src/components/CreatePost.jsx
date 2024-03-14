import React, { useState, useRef, useEffect } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./../firebase";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { SessionExpired } from "../utils/Alert";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { SelectMulti } from "../utils/Creatable";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [otherInput, setOtherInput] = useState(false);
  const [categorries, setCategorries] = useState(null);

  const [formData, setFormData] = useState({});

  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, [otherInput]);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts`);
        const data = await res.json();
        // console.log("category:", data.posts);

        if (res.ok) {
          const getCategory = data.posts.map((post) => post.category);
          const flattenedArray = getCategory.flat();
          console.log(flattenedArray);

          setCategorries(flattenedArray);
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
    fetchPost();
  }, []);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  // on backspace if the input became empty , then show the options again.
  const handlekeyPress = (event) => {
    if (event.keyCode === 8 && formData.category === "") {
      setOtherInput(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        if (res.status === 401) {
          SessionExpired().then(() => {
            dispatch(signoutSuccess());
            navigate("/sign-in", { replace: true });
          });
        }
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  console.log(categorries);

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold">Create a Post</h1>
      <form
        action=""
        className="flex flex-col gap-4"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            className="flex-1"
            placeholder="Title"
            id="title"
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          {/* {otherInput ? (
            <TextInput
              ref={inputRef}
              placeholder="Enter a Category"
              type="text"
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
              }}
              onBlur={() =>
                formData.category === undefined && setOtherInput(false)
              }
              onKeyDown={handlekeyPress}
            />
          ) : (
            <Select
              onChange={(e) => {
                e.target.value === "other"
                  ? setOtherInput(true)
                  : setFormData({ ...formData, category: e.target.value });
              }}
            >
              <option disabled selected>
                Select a Category
              </option>
              {categorries &&
                // removing duplicates from categories list
                Array.isArray(categorries) &&
                Array.from(new Set(categorries)).map((item, index) => (
                  <option value={item} key={item + index} className="uppercase">
                    {item}
                  </option>
                ))}
              <option value="other">Others</option>
            </Select>
          )} */}
          <SelectMulti categorries={categorries} setFormData={setFormData} />
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-dotted p-3 border-teal-500">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUpdloadImage}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Something ..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish Your Post
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
