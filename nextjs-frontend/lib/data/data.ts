
export const managerTabNavs = [
    {
        title: "Curriculum",
        href: "#curriculum",
        order: 1
    },
    {
        title: "Instructors",
        href: "#instructors",
        order: 2
    },
    {
        title: "Students",
        href: "#students",
        order: 3
    },
    {
        title: "Reviews",
        href: "#reviews",
        order: 4
    },
    {
        title: "Settings",
        href: "#settings",
        order: 5
    }
]

export const instructorTabNavs = [
    {
        title: "Curriculum",
        href: "#curriculum",
        order: 1
    },
    {
        title: "Collaborators",
        href: "#collaborators",
        order: 2
    },
    {
        title: "Students",
        href: "#students",
        order: 3
    },
    {
        title: "Reviews",
        href: "#reviews",
        order: 4
    },
    {
        title: "Library",
        href: "#library",
        order: 5
    },
    {
        title: "Gamification",
        href: "#gamification",
        order: 6
    }
]

/**
 * @desc Filter By Status (All, Published, In Review, Draft)
 * @role For managers, instructors
 */
export const filterByStatusData = [
    {
        name: "All courses",
        slug: "all",
        path: "?courseStatus=all",
    },
    {
        name: "Published",
        slug: "published",
        path: "?courseStatus=published",
    },
    {
        name: "In Review",
        slug: "in-review",
        path: "?courseStatus=in-review",
    },
    {
        name: "Draft",
        slug: "draft",
        path: "?courseStatus=draft",
    }
];

/**
 * @desc Filter By Progress (All, In Progress, Finished)
 * @role For Students
 */
export const filterByProgressData = [
    {
        name: "All courses",
        slug: "all",
        path: "?courseStatus=all",
    },
    {
        name: "In Progress",
        slug: "in-progress",
        path: "?courseStatus=in-progress",
    },
    {
        name: "Finished",
        slug: "finished",
        path: "?courseStatus=finished",
    },
];