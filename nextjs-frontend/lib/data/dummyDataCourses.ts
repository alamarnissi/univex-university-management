
import singleCourseImg from "@/components/Common/assets/img1.jpg";
import UserImg from "@/components/Common/assets/user.png"

export const SingleCourseData = {
  title: "Complete FastAPI masterclass",
  description: "Learn everything about FastApi with Python, Full Stack, OAuth2, SQLAlchemy, RESTful APIs, and practice projects",
  nbrParticipant: 40,
  nbrReview: 4,
  image: singleCourseImg,
  instructors: [
    {
      first_name: "Angus",
      last_name: "MacGyver",
      profession: "UX/UI Designer",
      role: "presenter",
      image: "/images/instructors/instructor1.jpg"
    },
    {
      first_name: "Kate",
      last_name: "Tanner",
      profession: "UX/UI Designer",
      role: "editor",
      image: "/images/instructors/instructor2.jpg"
    }
  ],
  modules: [
    {
      title: "module Number 1",
      lessons: [
        {
          title: "Différence entre UX & uI"
        },
        {
          title: "lesson 2 UX Wireframe"
        }
      ]
    },
    {
      title: "module Number 2",
      lessons: [
        {
          title: "Différence entre UX & uI"
        },
        {
          title: "lesson 2 UX Wireframe"
        }
      ]
    }
  ]
}

export const tracksList = [
  {
    track_name: "learn Python for Beginners",
    created_at: "22/06/2023"
  },
  {
    track_name: "Simple Introduction to UX",
    created_at: "22/06/2023"
  },
  {
    track_name: "Management tudy Guide",
    created_at: "22/06/2023"
  },
  {
    track_name: "learn Python for Beginners",
    created_at: "22/06/2023"
  },
  {
    track_name: "learn Python for Beginners",
    created_at: "22/06/2023"
  },
  {
    track_name: "learn Python for Beginners",
    created_at: "22/06/2023"
  },
  {
    track_name: "learn Python for Beginners",
    created_at: "22/06/2023"
  }
]

export const topActiveLearnersData = [
  {
      image: UserImg,
      name: "Thomas Magum",
      xp: "1000 XP",
  },
  {
      image: UserImg,
      name: "Mike Torello",
      xp: "900 XP",
  },
  {
      image: UserImg,
      name: "Hannibal Smith",
      xp: "850 XP",
  },
  {
      image: UserImg,
      name: "April Curtis",
      xp: "800 XP",
  },
  {
      image: UserImg,
      name: "Angus MacGyver",
      xp: "700 XP",
  }
];

export const lessActiveLearnersData = [
  {
      image: UserImg,
      name: "Emily Thompson",
      xp: "140 XP",
  },
  {
      image: UserImg,
      name: "Olivia Brown",
      xp: "120 XP",
  },
  {
      image: UserImg,
      name: "Jackson Williams",
      xp: "115 XP",
  },
  {
      image: UserImg,
      name: "Benjamin Lee",
      xp: "45 XP",
  },
  {
      image: UserImg,
      name: "Isabella Johnson",
      xp: "20 XP",
  }
];