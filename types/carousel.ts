export interface CarouselSlide {
  id: string;
  image: string;
  title?: string;
  description?: string;
  alt: string;
}

export interface CarouselConfig {
  autoplayInterval: number;
  transitionDuration: number;
  pauseOnHover: boolean;
  enableSwipe: boolean;
  enableKeyboard: boolean;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  autoplayInterval?: number;
  showIndicators?: boolean;
  className?: string;
}

export interface CarouselSlideProps {
  slide: CarouselSlide;
  isActive: boolean;
  index: number;
}

export interface CarouselIndicatorsProps {
  total: number;
  activeIndex: number;
  onIndicatorClick: (index: number) => void;
}
