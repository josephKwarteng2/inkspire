import { z } from "zod";

export const blogFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required and must be at least 3 characters."),
  slug: z
    .string()
    .min(3, "Slug is required and must be at least 3 characters."),
  content: z
    .string()
    .min(10, "Content is required and must be at least 10 characters."),
  category: z.string().min(1, "Category is required."),
  author: z.string().min(1, "Author is required."),
  tags: z.array(z.string()).optional(),
  status: z.enum(["published", "draft", "scheduled"]),
  scheduledDate: z.string().optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  videoEmbed: z.string().optional(),
  excerpt: z.string().optional(),
});
