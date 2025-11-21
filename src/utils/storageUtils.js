import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Upload profile image to Firebase Storage
 * @param {string} userId - User's UID
 * @param {File} file - Image file to upload
 * @param {number} imageNumber - Image index (1-4)
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export async function uploadProfileImage(userId, file, imageNumber) {
  if (!file) throw new Error('No file provided');
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be less than 5MB');
  }
  
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `image_${imageNumber}.${fileExtension}`;
    const storageRef = ref(storage, `profileImages/${userId}/${fileName}`);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Delete profile image from Firebase Storage
 * @param {string} userId - User's UID
 * @param {number} imageNumber - Image index to delete
 */
export async function deleteProfileImage(userId, imageNumber) {
  try {
    const storageRef = ref(storage, `profileImages/${userId}/image_${imageNumber}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting profile image:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Upload verification selfie
 * @param {string} userId - User's UID
 * @param {File} file - Selfie image file
 * @returns {Promise<string>} - Download URL of uploaded selfie
 */
export async function uploadVerificationImage(userId, file) {
  if (!file) throw new Error('No file provided');
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be less than 5MB');
  }
  
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `verification_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `verificationImages/${userId}/${fileName}`);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading verification image:', error);
    throw new Error(`Failed to upload verification image: ${error.message}`);
  }
}

/**
 * Upload chat image
 * @param {string} chatId - Chat ID
 * @param {File} file - Image file
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export async function uploadChatImage(chatId, file) {
  if (!file) throw new Error('No file provided');
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image must be less than 10MB');
  }
  
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `chat_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `chatImages/${chatId}/${fileName}`);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading chat image:', error);
    throw new Error(`Failed to upload chat image: ${error.message}`);
  }
}

/**
 * Compress image before upload
 * @param {File} file - Image file to compress
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
