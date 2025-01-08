import { Menu } from "@/lib/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: `links.main.home`, // we used links.home to get the translated word from @/lib/messages/{local}.json
    path: "#home",
    newTab: false,
  },
  {
    id: 2,
    title: `links.main.features`,
    path: "#features",
    newTab: false,
  },
  {
    id: 33,
    title: `links.main.pricing`,
    path: "#pricing",
    newTab: false,
  },
  {
    id: 3,
    title: `links.main.faqs`,
    path: "#faqs",
    newTab: false,
  },
  {
    id: 4,
    title: `links.main.contactUs`,
    path: "#contact",
    newTab: false,
  },
];
export default menuData;
