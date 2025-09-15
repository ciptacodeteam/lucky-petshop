"use client";

import {
  Carousel,
  CarouselContent,
  CarouselDotButton,
  CarouselItem,
  useCarouselDotButton,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

type BannerItem = {
  id: number;
  imageUrl: string;
  title: string;
  link: string;
};

const bannerItems: BannerItem[] = [
  {
    id: 1,
    imageUrl: "/images/banners/banner-1.jpg",
    title: "Summer Sale - Up to 50% Off!",
    link: "/sale",
  },
  {
    id: 2,
    imageUrl: "/images/banners/banner-1.jpg",
    title: "New Arrivals for Your Furry Friend",
    link: "/new-arrivals",
  },
  {
    id: 3,
    imageUrl: "/images/banners/banner-1.jpg",
    title: "Adopt, Don't Shop - Find Your New Best Friend",
    link: "/adopt",
  },
];

type Props = {
  className?: string;
};

const BannerSection = ({ className }: Props) => {
  const [emblaApi, setEmblaApi] = useState<CarouselApi>(undefined);

  const onNavButtonClick = useCallback((emblaApi: CarouselApi) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useCarouselDotButton(
    emblaApi,
    onNavButtonClick,
  );

  return (
    <section className={cn("py-16 pb-8 lg:pb-16", className)}>
      <Carousel
        setApi={setEmblaApi}
        className="relative"
        plugins={[Autoplay()]}
      >
        <CarouselContent>
          {bannerItems.map((item) => (
            <CarouselItem key={item.id} className="w-full">
              {item.link ? (
                <Link href={item.link}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={1200}
                    height={400}
                    className="h-auto max-h-[500px] w-full rounded-lg object-cover"
                    priority
                  />
                </Link>
              ) : (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={1200}
                  height={400}
                  className="h-auto max-h-[500px] w-full rounded-lg object-cover"
                  priority
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <footer className="bg-foreground/10 absolute bottom-3 left-1/2 mx-auto mt-4 flex w-fit -translate-x-1/2 justify-center gap-2 rounded-full p-2 md:bottom-5">
          {scrollSnaps.map((_, index) => (
            <CarouselDotButton
              key={index}
              active={index === selectedIndex}
              onClick={() => onDotButtonClick(index)}
              className="size-1.5 md:size-2.5"
            />
          ))}
        </footer>
      </Carousel>
    </section>
  );
};
export default BannerSection;
