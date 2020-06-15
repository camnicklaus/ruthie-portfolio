import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

const WIDTHS = {
  sm: '640',
  md: '768',
  lg: '1024',
  xlg: '1280',
};

const cachedImages = [];

export default class ImageComponent extends Component {
  @tracked isImageLoaded = false;
  @tracked calculatedWidth = 0;
  @tracked calculatedHeight = 0;

  get fetchWidth() {
    switch (true) {
      case this.calculatedWidth < WIDTHS.sm:
        return `/w_${WIDTHS.sm}`;
      case this.calculatedWidth < WIDTHS.md:
        return `/w_${WIDTHS.md}`;
      case this.calculatedWidth < WIDTHS.lg:
        return `/w_${WIDTHS.lg}`;
      case this.calculatedWidth < WIDTHS.xlg:
        return `/w_${WIDTHS.xlg}`;
      default:
        return '';
    }
  }

  get src() {
    const originalSrc = this.args.src;
    const regex = /(.+)(\/v)/;

    // this inserts the quality and dynamic width into the URL
    return originalSrc.replace(regex, `$1/q_auto:best${this.fetchWidth}$2`);
  }

  @action
  init() {
    this.calculateAndLoadImage();
    window.addEventListener('resize', this.calculateAndLoadImage);
  }

  @action
  calculateAndLoadImage() {
    this.calcDimensions();
    this.loadImage();
  }

  @action
  removeListener() {
    window.removeEventListener('resize', this.calculateAndLoadImage);
  }

  @action
  calcDimensions() {
    let aspectRatio = this.args.aspectWidth / this.args.aspectHeight;
    let el = document.getElementById(this.args.id);
    let offsetWidth = el.offsetWidth;
    this.calculatedWidth = offsetWidth;
    this.calculatedHeight = offsetWidth / aspectRatio;
  }

  loadImage() {
    const image = new Image();
    image.src = this.src;

    if (image.complete) {
      this.isImageLoaded = true;
    } else {
      image.onload = () => {
        // attempt to cache images so they don't reload on page resize if they've already been fetched
        // tbh I'm not sure why this works but it seems to
        cachedImages.push(image);
        this.isImageLoaded = true;
      };

      image.onerror = () => {
        this.isImageLoaded = true;
        throw new Error('Image failed to load');
      };
    }
  }
}