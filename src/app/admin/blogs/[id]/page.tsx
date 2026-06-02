"use client";

import { useParams } from "next/navigation";
import BlogEditor from "../edit-form";

export default function EditBlogPost() {
  const params = useParams();
  return <BlogEditor postId={Number(params.id)} />;
}
