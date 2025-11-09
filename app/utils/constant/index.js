import {
  BuildingStorefrontIcon,
  ChevronDoubleRightIcon,
  HomeIcon,
  LinkIcon,
  UserCircleIcon,
  VariableIcon,
} from "@heroicons/react/24/outline";

export const mainNavigation = [
  {
    title: "Main",
    navigation: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
    ],
  },
  {
    title: "Manage List ",
    navigation: [
      {
        name: "Company",
        href: "/dashboard/company",
        icon: LinkIcon,
        current: false,
      },
      {
        name: "Request",
        href: "/dashboard/add-listing",
        icon: LinkIcon,
        current: false,
      },
      {
        name: "Wallet",
        href: "/dashboard/add-listing",
        icon: LinkIcon,
        current: false,
      },
    ],
  },
  {
    title: "Manage Account",
    navigation: [
      {
        name: "Users",
        href: "/dashboard/user",
        icon: BuildingStorefrontIcon,
        current: false,
      },
      {
        name: "My Package",
        href: "/brand",
        icon: BuildingStorefrontIcon,
        current: false,
      },
      {
        name: "My Profile",
        href: "/brand",
        icon: BuildingStorefrontIcon,
        current: false,
      },
      {
        name: "Logout",
        href: "/brand",
        icon: BuildingStorefrontIcon,
        current: false,
      },
    ],
  },
];
