import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { SessionExpired } from "../utils/Alert";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from 'react-redux';
import { SelectMulti } from "./../utils/Creatable";

const Search = () => {
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [otherInput, setOtherInput] = useState(false);
  const [categorries, setCategorries] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef();
  // console.log("sidebar: ", sideBarData);
  useEffect(() => {
    inputRef.current?.focus();
  }, [otherInput]);
  useEffect(() => {
    const fetchPostForCategory = async () => {
      try {
        const res = await fetch(`/api/post/getposts`);
        const data = await res.json();

        if (res.ok) {
          // [
          //   ["Covid", "China "],
          //   ["milk", "Event.KeyCode", "casdf"],
          //   ["meta", "milk"],
          //   ["Dom"],
          //   ["Event.KeyCode"],
          //   ["MernSTack"],
          //   ["MernSTack"],
          //   ["react"],
          //   ["react"],
          // ];
          //converting this data into a single array
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
    fetchPostForCategory();
  }, []);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSideBarData({
        ...sideBarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    const fetchPost = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        console.log("searchQuery:-", searchQuery);
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        const data = await res.json();
        console.log("data: " + data.posts);

        if (!res.ok) {
          if (res.status === 401) {
            SessionExpired().then(() => {
              dispatch(signoutSuccess());
              navigate("/sign-in", { replace: true });
            });
            setLoading(false);
            return;
          }
        }
        if (res.ok) {
          setPosts(data.posts);
          setLoading(false);
        }
        if (data.posts.length > 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPost();
  }, [location.search]);
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSideBarData({ ...sideBarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSideBarData({ ...sideBarData, category: category });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("category", sideBarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };
  const handlekeyPress = (event) => {
    if (event.keyCode === 8 && formData.category === "") {
      setOtherInput(false);
    }
  };
  console.log(sideBarData);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <TextInput
              placeholder="Search...!"
              id="searchTerm"
              type="text"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sideBarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            {otherInput ? (
              <TextInput
                ref={inputRef}
                placeholder="Enter a Category"
                type="text"
                onChange={(e) => {
                  setSideBarData({ ...sideBarData, category: e.target.value });
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
                    : setSideBarData({
                        ...sideBarData,
                        category: e.target.value,
                      });
                }}
              >
                <option disabled selected>
                  Select a Category
                </option>
                {categorries &&
                  // removing duplicates from categories list
                  Array.isArray(categorries) &&
                  Array.from(new Set(categorries)).map((item, index) => (
                    <option
                      value={item}
                      key={item + index}
                      className="uppercase"
                    >
                      {item}
                    </option>
                  ))}
                <option value="other">Others</option>
              </Select>
            )}
            {/* <SelectMulti
              id="category"
              isMulti={false}
              categorries={categorries}
              setFormData={setSideBarData}
            /> */}
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
