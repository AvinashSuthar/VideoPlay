import React, { useState, useEffect, useContext } from "react";
import { fetchAllVideos } from "../services/videoServices";
import { AuthContext } from "../context/AuthContext";
import VideoPlayerUI from "./VideoPlayerUi";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const getVideos = async () => {
      try {
        if (auth.token) {
          const videoData = await fetchAllVideos(auth.token);
          if (videoData && Array.isArray(videoData)) {
            setVideos(videoData); 
          } else {
            setError("Failed to load videos");
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    getVideos();
  }, [auth.token]);

  return (
    <div className="container-fluid mt-5 text-center">
      <div className="row">
        <h1>Video Library</h1>
        {error && <p>Error: {error}</p>}
        {videos.length > 0 ? (
          <VideoPlayerUI videos={videos} />
        ) : (
          <p>No videos available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
