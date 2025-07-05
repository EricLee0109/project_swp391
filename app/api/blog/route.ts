import { auth } from "@/auth";
import { GETBlog } from "@/types/blog/blog";

export async function GET() {
  // Fetch blogs from the database or data source
  const blogs = await fetchBlogsFromDatabase(); // Replace with actual data fetching logic
  return new Response(JSON.stringify(blogs), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const newBlog = await request.json();
  // Add the new blog to the database or data source
  const createdBlog = await createBlogInDatabase(newBlog); // Replace with actual data creation logic
  return new Response(JSON.stringify(createdBlog), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request: Request) {
  const updatedBlog = await request.json();
  // Update the blog in the database or data source
  const result = await updateBlogInDatabase(updatedBlog); // Replace with actual data update logic
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  // Delete the blog from the database or data source
  await deleteBlogFromDatabase(id); // Replace with actual data deletion logic
  return new Response(null, {
    status: 204,
  });
}

// Placeholder functions for database operations
async function fetchBlogsFromDatabase() {
  // Implement your data fetching logic here
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Access token is required to create a blog");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };

  const res = await fetch(`${process.env.BE_BASE_URL}/blogs`, {
    method: "GET",
    headers,
  });

  if (!res.ok) throw new Error(res.statusText);

  return res.json();
}

async function createBlogInDatabase(blog: GETBlog) {
  // Implement your data creation logic here
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Access token is required to create a blog");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };

  const res = await fetch(`${process.env.BE_BASE_URL}/blogs`, {
    method: "POST",
    headers,
    body: JSON.stringify(blog),
  });

  if (!res.ok) throw new Error(res.statusText);

  return res.json();
}

async function updateBlogInDatabase(blog: GETBlog) {
  // Implement your data update logic here
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Access token is required to create a blog");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };

  const res = await fetch(`${process.env.BE_BASE_URL}/blogs/${blog.post_id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(blog),
  });

  if (!res.ok) throw new Error(res.statusText);

  return res.json();
}

async function deleteBlogFromDatabase(id: string) {
  // Implement your data deletion logic here
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Access token is required to create a blog");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };

  const res = await fetch(`${process.env.BE_BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) throw new Error(res.statusText);

  return res;
}
