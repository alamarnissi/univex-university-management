import slugify from "slugify";

export function slugify_title(title: string): string {
    const slugifyed_title = slugify(title, { lower: true });
    const random_key = Math.random().toString(36).substring(2, 10) + "-" + Math.random().toString(36).substring(2, 10);

    return slugifyed_title + "-" + random_key
}