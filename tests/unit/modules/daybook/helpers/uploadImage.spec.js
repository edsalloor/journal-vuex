import uploadImage from '@/modules/daybook/helpers/uploadImage';
import cloudinaryApi from '@/api/cloudinaryApi';

jest.mock('@/api/cloudinaryApi');
const imgUrl = 'https://res.cloudinary.com/cld-sample.jpg';
const postMock = jest.fn(() => Promise.resolve({
  data: { secure_url: imgUrl }
}));
cloudinaryApi.post = postMock;

describe('uploadImage', () => {
  it('should upload image file and return URL', async () => {
    const imageFile = {};
    const expectedFormData = new FormData();
    expectedFormData.append('upload_preset', 'vue-fh');
    expectedFormData.append('file', imageFile);

    const result = await uploadImage(imageFile);

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith('/image/upload', expectedFormData);
    expect(result).toBe(imgUrl);
  });
});
