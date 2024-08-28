import axios from "axios";
import { VIDEO_BASE_ROUTE } from "../Constants";

const API_URL = `${VIDEO_BASE_ROUTE}/`;

export const fetchAllVideos = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch videos");
  }
};

export const updateProgress = async (
  currentTime,
  isCompleted,
  videoId,
  token
) => {
  try {
    await axios.put(
      `${API_URL}/update-progress/${videoId}`,
      { lastWatchedTime: currentTime, completed: isCompleted },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error updating progress:", error);
  }
};
