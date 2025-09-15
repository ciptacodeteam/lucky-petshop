"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { IconDogBowl } from "@tabler/icons-react";
import Link from "next/link";
import AskLuckyButton from "../ui/ask-lucky-button";

type CategoryMenu = {
  name: string;
  link: string;
  subCategories?: CategoryMenu[];
};

const categoryMenus: CategoryMenu[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Woof meal",
    link: "#",
    subCategories: [
      {
        name: "Dry food",
        link: "#",
      },
      {
        name: "Wet food",
        link: "#",
      },
    ],
  },
  {
    name: "Meow meal",
    link: "#",
    subCategories: [
      {
        name: "Dry food",
        link: "#",
      },
      {
        name: "Wet food",
        link: "#",
      },
    ],
  },
  {
    name: "Playtime fun",
    link: "#",
  },
  {
    name: "Paw showcase",
    link: "#",
  },
  {
    name: "Lucky education",
    link: "#",
  },
  {
    name: "Lucky care",
    link: "#",
  },
];

const CategoryBar = () => {
  return (
    <div className="border-t">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="text-primary bg-white px-4 py-2 text-sm sm:px-6 lg:px-10">
            {categoryMenus.map((category) =>
              category.subCategories ? (
                <NavigationMenuItem key={category.name}>
                  <NavigationMenuTrigger className="hover:text-primary bg-transparent">
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    asChild
                    className="min-w-[300px] pb-3 !shadow-none"
                  >
                    <ul className="flex flex-col">
                      {category.subCategories.map((subCategory) => (
                        <li key={subCategory.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={subCategory.link}
                              className="block px-4 py-2 hover:bg-gray-100"
                            >
                              <div className="grid grid-cols-6 items-center gap-2">
                                <IconDogBowl className="size-6 shrink-0" />
                                <div className="col-span-5">
                                  {subCategory.name}
                                  <div className="text-muted-foreground text-xs">
                                    Explore our collection of {subCategory.name}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={category.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={category.link}
                      className="hover:text-primary rounded-md px-3 py-2 hover:bg-gray-100"
                    >
                      {category.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <AskLuckyButton />
      </div>
    </div>
  );
};
export default CategoryBar;
