import Link from "next/link";

type AnnouncementItem = {
  text: string;
  linkText: string;
  linkUrl: string;
};

const announcementItems: AnnouncementItem[] = [
  {
    text: "Get 30% OFF your first order - order now and get it delivered - ",
    linkText: "Learn more",
    linkUrl: "#",
  },
  // You can add more announcement items here
];

const AnnouncementBar = () => {
  return (
    <div className="bg-secondary flex w-full items-center justify-center py-2 text-center lg:h-9">
      {announcementItems.map((item, index) => (
        <p
          key={index}
          className="text-primary px-4 text-xs font-bold sm:text-sm"
        >
          {item.text}
          <Link href={item.linkUrl} className="font-normal underline">
            {item.linkText}
          </Link>
        </p>
      ))}
    </div>
  );
};
export default AnnouncementBar;
