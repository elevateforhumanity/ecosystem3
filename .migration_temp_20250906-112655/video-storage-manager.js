/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

// Video Storage Manager for LMS
// Uses Replit Object Storage for video content

import path from 'path';
import fs from 'fs/promises';

class VideoStorageManager {
  constructor() {
    this.bucketId = process.env.REPLIT_OBJECT_STORAGE_BUCKET_ID;
    this.baseUrl = `https://storage.replit.com/${this.bucketId}`;
  }

  // Upload video to Replit Object Storage
  async uploadVideo(videoFile, courseId, lessonId) {
    try {
      const fileName = `videos/${courseId}/${lessonId}/${videoFile.name}`;

      // Use Replit Object Storage API
      const response = await fetch(`${this.baseUrl}/${fileName}`, {
        method: 'PUT',
        body: videoFile,
        headers: {
          'Content-Type': videoFile.type
        }
      });

      if (response.ok) {
        return {
          success: true,
          videoUrl: `${this.baseUrl}/${fileName}`,
          fileName: fileName
        };
      }

      throw new Error('Upload failed');
    } catch (error) {
      console.error('Video upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate signed URL for video access
  getVideoUrl(courseId, lessonId, filename) {
    return `${this.baseUrl}/videos/${courseId}/${lessonId}/${filename}`;
  }

  // List all videos for a course
  async getCourseVideos(courseId) {
    try {
      const response = await fetch(`${this.baseUrl}/videos/${courseId}/`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching course videos:', error);
      return [];
    }
  }
}

export default VideoStorageManager;