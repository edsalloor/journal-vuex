import cloudinaryApi from '@/api/cloudinaryApi';

const uploadImage = async (imageFile) => {
  if (!imageFile) return;

  try {
    const formData = new FormData();
    formData.append('upload_preset', 'vue-fh');
    formData.append('file', imageFile);

    const { data } = await cloudinaryApi.post('/image/upload', formData);
    return data.secure_url;
  } catch (error) {
    console.error('Cannot upload image to Cloudinary');
    return null;
  }
};

export default uploadImage;
