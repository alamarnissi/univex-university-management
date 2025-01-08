// Icon Imports

import { BookMarked, LayoutDashboard } from "lucide-react";
import { AnalyticsIcon, CoursesIcon, InstructorsIcon, AcademyIcon, PaymentSetupIcon, StudentsIcon, TracksIcon, LeaderBoardIcon } from "../../components/Common/assets/sidebarIcons";
import { Summaries } from "@/components/Common/assets/singleCourse/Summaries";
import { Notes } from "@/components/Common/assets/singleCourse/Notes";
import { Forum } from "@/components/Common/assets/singleCourse/Forum";
  
  export const routes = [
    {
      name: "Dashboard",
      layout: "/dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      hasRole: ["manager", "instructor", "student"],
      hasChild: false,
      children: []
    },
    {
      name: "My Academy",
      layout: "/dashboard",
      path: "/academy",
      icon: <AcademyIcon className="h-5 w-5" />,
      hasRole: ["manager", "instructor", "student"],
      hasChild: true,
      children: [
        {
          name: "Courses",
          layout: "/dashboard/academy",
          path: "/",
          icon: <CoursesIcon className="h-5 w-5" />,
          hasRole: ["manager", "instructor", "student"],
        },
        {
          name: "Tracks",
          layout: "/dashboard/academy",
          path: "/tracks",
          icon: <TracksIcon className="h-5 w-5" />,
          hasRole: ["manager", "instructor", "student"],
        },
        {
          name: "Instructors",
          layout: "/dashboard/academy",
          path: "/instructors",
          icon: <InstructorsIcon className="h-5 w-5" />,
          hasRole: ["manager"],
        },
        {
          name: "Students",
          layout: "/dashboard/academy",
          path: "/students",
          icon: <StudentsIcon className="h-5 w-5" />,
          hasRole: ["manager"],
        },
        // {
        //   name: "Groups",
        //   layout: "/dashboard/academy",
        //   path: "/groups",
        //   icon: <BsCameraVideo className="h-5 w-5" />,
        //   hasRole: ["manager", "instructor", "student"],
        // },
      ]
    },
    {
      name: "Leaderboard",
      layout: "/dashboard",
      path: "/leaderboard",
      icon: <LeaderBoardIcon className="h-5 w-5" />,
      hasRole: ["student"],
      hasChild: false,
      children: []
    },
    {
      name: "Analytics",
      layout: "/dashboard",
      path: "/analytics",
      icon: <AnalyticsIcon className="h-5 w-5" />,
      hasRole: ["manager", "instructor"],
      hasChild: false,
      children: []
    },
    {
      name: "Payment Setup",
      layout: "/dashboard",
      path: "/payment-setup",
      icon: <PaymentSetupIcon className="h-5 w-5" />,
      hasRole: ["manager"],
      hasChild: false,
      children: []
    },
  ];
  
  export const studentSingleCourseRoutes = [
      {
        name: "Course Content",
        layout: "/academy",
        path: "/academy/:slug",
        icon: <BookMarked className="h-5 w-5 text-black dark:text-gray-600" />,
        hasChild: true,
      },
      {
        name: "Summaries",
        layout: "/academy",
        path: "summaries",
        icon: <Summaries className="text-black dark:text-gray-600" />,
        hasChild: false,
      },
      {
        name: "Notes",
        layout: "/academy",
        path: "notes",
        icon: <Notes className="text-black dark:text-gray-600" />,
        hasChild: false,
      },
      {
        name: "Forum",
        layout: "/academy",
        path: "forum",
        icon: <Forum className="text-black dark:text-gray-600" />,
        hasChild: false,
      },
  ]
  