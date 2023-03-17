import { ContentfulAsset, ContentfulPlain } from '../../types';
import { ImageFormat, ResizingBehavior, imageProps } from '../image';

const image: ContentfulPlain<ContentfulAsset> = {
  title: 'Image title',
  url: 'http://image.org',
};

describe('contentful / helpers / image', () => {
  describe('imageUrl', () => {
    describe('with default options', () => {
      it('should return alt title', () => {
        expect(imageProps(image).alt).toEqual('Image title');
      });

      it('should return jpg url with default options', () => {
        expect(imageProps(image).src).toEqual('http://image.org?fl=progressive&fm=jpg&q=90');
      });
    });

    describe('with custom options', () => {
      it('should return src using custom options', () => {
        const options = {
          format: ImageFormat.WEBP,
          size: {
            height: 100,
          },
          quality: 50,
          resizingBehavior: ResizingBehavior.FILL,
        };
        expect(imageProps(image, options).src).toEqual('http://image.org?fit=fill&fl=progressive&fm=webp&h=100&q=50');
      });
    });

    describe('with missing image url', () => {
      it('should return empty string', () => {
        const missingImage = {
          title: 'Image title',
        };

        expect(imageProps(missingImage).src).toEqual('?fl=progressive&fm=jpg&q=90');
      });
    });

    describe('with empty options', () => {
      it('should return jpg url with default options', () => {
        const emptyOptions = {};
        expect(imageProps(image, emptyOptions).src).toEqual('http://image.org?fl=progressive&fm=jpg&q=90');
      });
    });
  });
});
