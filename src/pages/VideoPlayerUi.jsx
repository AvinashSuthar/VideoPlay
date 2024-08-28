import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateProgress } from "../services/videoServices";
import { BASE_ROUTE } from "../Constants";

const VideoPlayerUI = ({ videos }) => {
  const { auth, fetchUserData } = useContext(AuthContext);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Track current video
  const [lastWatchedTime, setLastWatchedTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const videoRef = useRef(null);
  const currentVideo = videos[currentVideoIndex];
  useEffect(() => {
    const lastWatched = auth.user.videoProgress?.find(
      (progress) => progress.completed === false
    );

    if (lastWatched) {
      const videoIndex = videos.findIndex(
        (video) => video._id === lastWatched.videoId
      );
      if (videoIndex !== -1) {
        setCurrentVideoIndex(videoIndex);
        setLastWatchedTime(lastWatched.lastWatchedTime);
      }
    }
  }, [auth.user, videos]);
  useEffect(() => {
    const fetchLastWatchedTime = () => {
      const videoProgress = auth.user.videoProgress.find(
        (progress) => progress.videoId === currentVideo._id
      );
      return videoProgress ? videoProgress.lastWatchedTime : 0;
    };

    const videoElement = videoRef.current;
    const calculateProgress = () => {
      const completedVideos = auth.user.videoProgress.filter(
        (progress) => progress.completed
      );
      return Math.floor((completedVideos.length / videos.length) * 100);
    };
    const handleTimeUpdate = () => {
      const currentTime = videoElement.currentTime;
      setLastWatchedTime(currentTime);

      if (Math.floor(currentTime) % 5 === 0) {
        updateProgress(currentTime, completed, currentVideo._id, auth.token);
      }

      if (currentTime > lastWatchedTime + 5) {
        videoElement.currentTime = lastWatchedTime;
      }
    };

    const handleEnded = () => {
      setCompleted(true);
      updateProgress(lastWatchedTime, true, currentVideo._id, auth.token);
      calculateProgress();
      if (currentVideoIndex + 1 < videos.length) {
        setCurrentVideoIndex(currentVideoIndex + 1);
        setCompleted(false);
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("ended", handleEnded);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("ended", handleEnded);
    };
  }, [currentVideoIndex, lastWatchedTime, completed, auth]);

  const navigateBack = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };
  const calculateProgress = () => {
    const completedVideos = auth.user.videoProgress.filter(
      (progress) => progress.completed
    );
    return Math.floor((completedVideos.length / videos.length) * 100);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>{currentVideo.title}</h2>
          <p>
            <div
              className="ms-5 me-5 mt-5 text-start"
              dangerouslySetInnerHTML={{ __html: currentVideo.description }}
            ></div>
          </p>
        </div>
        <div className="col">
          {videos && (
            <div className="">
              <h3>Progress: {calculateProgress()}%</h3>
            </div>
          )}
          <video
            ref={videoRef}
            id={`video-${currentVideo._id}`}
            src={`${BASE_ROUTE}${currentVideo.videoUrl}`}
            controls
            controlsList="nodownload noplaybackrate"
            width="700px"
          ></video>
          <div className="controls">
            {currentVideoIndex > 0 && (
              <button className="btn btn-dark" onClick={navigateBack}>
                Previous Video
              </button>
            )}
            <br />
            {currentVideoIndex + 1 === videos.length && completed && (
              <button disabled>No More Videos</button>
            )}
          </div>
          <div>
            {currentVideoIndex < videos.length - 1 ? (
              <div>{videos[currentVideoIndex + 1].title}</div>
            ) : (
              <div>No videos</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerUI;

