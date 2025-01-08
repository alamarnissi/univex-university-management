import { FeaturesDataType, HelpDataType, PlatformDataType } from "./types/dataTypes"
// help section images
import helpImg1 from "@/components/Help/img1.jpg"
import helpImg2 from "@/components/Help/img2.jpg"
import helpImg3 from "@/components/Help/img3.jpg"
import helpImg4 from "@/components/Help/img4.jpg"

// features section images
import ClassroomsImg from "@/components/Features/assets/virtuel_classroom.svg"
import GroupsImg from "@/components/Features/assets/group_learning.svg"
import PathsImg from "@/components/Features/assets/learning_paths.svg"
import ChatbotsImg from "@/components/Features/assets/chatbots.svg"

// social media icons
import facebookIcon from "@/components/Contact/assets/facebook.svg"
import twitterIcon from "@/components/Contact/assets/twitter.svg"
import instaIcon from "@/components/Contact/assets/instagram.svg"
import linkedinIcon from "@/components/Contact/assets/linkedin.svg"

export const HelpData : HelpDataType[] = [
    {
        'id': 1,
        'image': helpImg1,
        'title': `HelpSection.firstCard.heading`,  // used for translation pursose (check @/lib/message/{locale}.json)
        'list': [
            `HelpSection.firstCard.list.first`,
            `HelpSection.firstCard.list.second`
        ]
    },
    {
        'id': 2,
        'image': helpImg2,
        'title': `HelpSection.secondCard.heading`,
        'list': [
            `HelpSection.secondCard.list.first`,
            `HelpSection.secondCard.list.second`
        ]
    },
    {
        'id': 3,
        'image': helpImg3,
        'title': `HelpSection.thirdCard.heading`,
        'list': [
            `HelpSection.thirdCard.list.first`,
            `HelpSection.thirdCard.list.second`
        ]
    },
    {
        'id': 4,
        'image': helpImg4,
        'title': `HelpSection.fourthCard.heading`,
        'list': [
            `HelpSection.fourthCard.list.first`,
            `HelpSection.fourthCard.list.second`
        ]
    }
]

export const PlatformData : PlatformDataType[] = [
    {
        'id': 1,
        'title': `PlatformSection.list.first`,
        'bgColor': "bg-[#4BA0FF]"
    },
    {
        'id': 2,
        'title': `PlatformSection.list.second`,
        'bgColor': "bg-[#FBD06F]"
    },
    {
        'id': 3,
        'title': `PlatformSection.list.third`,
        'bgColor': "bg-[#A097FF]"
    },
    {
        'id': 4,
        'title': `PlatformSection.list.fourth`,
        'bgColor': "bg-[#48DB7A]"
    }
]

export const FeaturesData: FeaturesDataType[] = [
    {
        "id": 1,
        "image": ClassroomsImg,
        "imgSize": 86,
        "title": `FeaturesSection.firstFeature.heading`,
        "text": `FeaturesSection.firstFeature.desc`
    },
    {
        "id": 2,
        "image": GroupsImg,
        "imgSize": 68,
        "title": `FeaturesSection.secondFeature.heading`,
        "text": `FeaturesSection.secondFeature.desc`
    },
    {
        "id": 3,
        "image": PathsImg,
        "imgSize": 70,
        "title": `FeaturesSection.thirdFeature.heading`,
        "text": `FeaturesSection.thirdFeature.desc`
    },
    {
        "id": 4,
        "image": ChatbotsImg,
        "imgSize": 94,
        "title": `FeaturesSection.fourthFeature.heading`,
        "text": `FeaturesSection.fourthFeature.desc`
    }
]

export const socialMedia = [
    {
        "id": 1,
        "title": "facebook",
        "link": "https://www.facebook.com/",
        "icon": facebookIcon
    },
    {
        "id": 2,
        "title": "twitter",
        "link": "https://www.twitter.com",
        "icon": twitterIcon
    },
    {
        "id": 3,
        "title": "instagram",
        "link": "https://instagram.com",
        "icon": instaIcon
    },
    {
        "id": 4,
        "title": "linkedin",
        "link": "https://www.linkedin.com/company/",
        "icon": linkedinIcon
    },
]

