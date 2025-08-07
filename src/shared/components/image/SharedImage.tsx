import { Image, type ImageProps as HeroUIImageProps } from '@heroui/react';
import { TbPhoto } from 'react-icons/tb';
import { cn } from '@heroui/theme';

interface SharedImageProps extends Omit<HeroUIImageProps, 'radius'> {
  src: string;
  alt?: string;
  className?: string;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full' | undefined;
  fallbackSrc?: string;
  isBlurred?: boolean;
  isZoomed?: boolean;
  removeWrapper?: boolean;
  disableSkeleton?: boolean;
  classNames?: {
    wrapper?: string;
    zoomedWrapper?: string;
    img?: string;
    blurredImg?: string;
  };
}

const SharedImage = ({
  src,
  alt = 'Image',
  className,
  radius = 'md',
  fallbackSrc,
  onError,
  onLoad,
  ...props
}: SharedImageProps) => { 

  // If there's an error and no fallbackSrc, or if fallbackSrc also fails, show icon
  if (!src) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-default-100 text-default-400 w-full',
          className
        )}
        style={{
          borderRadius: radius === 'none' ? '0' : 
                      radius === 'sm' ? '0.375rem' :
                      radius === 'md' ? '0.5rem' :
                      radius === 'lg' ? '0.75rem' : 
                      radius === 'full' ? '9999px' : '0.5rem'
        }}
      >
        <TbPhoto className="w-[40%] h-[40%]" />
      </div>
    );
  } 

  return (
    <Image
      src={src}
      alt={alt}
      radius={radius}
      className={cn('w-full h-full object-cover', className)} 
      fallbackSrc={fallbackSrc}  
      {...props}
    />
  );
};

export default SharedImage;