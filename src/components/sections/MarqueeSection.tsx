"use client";

import Marquee from "react-fast-marquee";

type MarqueeItem = {
  text: string;
};

const marqueeItems: MarqueeItem[] = [
  {
    text: "Get 30% OFF your first order - order now and get it delivered - ",
  },
  {
    text: "Free shipping on orders over $50 - Shop now and save big! - ",
  },
  {
    text: "New arrivals are here - Check out the latest products in our store! - ",
  },
];

const MarqueeSection = () => {
  return (
    <section className="bg-secondary py-3 lg:py-6">
      <div className="relative overflow-hidden">
        <Marquee autoFill speed={50}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center">
              <span className="text-primary mx-20 text-xl font-bold">•</span>
              <span className="text-primary text-xs font-bold whitespace-nowrap lg:text-sm">
                {item.text}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
export default MarqueeSection;
