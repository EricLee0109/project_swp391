import { auth } from "@/auth";
import BlogHome from "@/components/home/Blogs";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";

import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import SearchForm from "@/components/SearchForm";
import { GETBlog } from "@/types/blog/blog";

import { redirect } from "next/navigation";

// type StartupCardType = {
//   _id?: number;
//   _createdAt: Date;
//   views: number;
//   author: {
//     _id: number;
//     name: string;
//   };
//   description: string;
//   image: string;
//   category: string;
//   title: string;
// };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const session = await auth();
  const role = session?.user?.role; // Safely get the role

  if (
    session &&
    role !== "Customer" &&
    role !== "Staff" &&
    role !== "Consultant"
  ) {
    return redirect("/dashboard");
  } else {
    return;
  }

  async function getBlogs() {
    const res = await fetch(`${process.env.BE_BASE_URL}/blogs/public`, {
      method: "GET",
      next: { revalidate: 3600 }, //caching 1 hour
    });
    return res.json();
  }

  const blogData = await getBlogs();
  const blogs: GETBlog[] = blogData.blogs;

  // const posts = [
  //   {
  //     _createdAt: new Date(),
  //     views: 150,
  //     author: { _id: 1, name: "Eric Le" },
  //     _id: 1,
  //     description: "This is a description",
  //     image:
  //       "https://images.unsplash.com/photo-1575998064976-9df66085cc83?q=80&w=1673&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     category: "STIs",
  //     title: "Symtoms of STIs",
  //   },
  // ];

  return (
    <div>
      <section className="pink_container">
        <h1 className="heading">
          Menstrual Cycle, <br />
          Sexual Health Care
        </h1>

        <p className="sub-heading !max-w-3xl">
          Easy to follow menstrual cycle with automatic system, update sexual
          health knowledge by blogs, meet professional consultant, personal
          information confidential, fast payment, and more.
        </p>

        <SearchForm query={query} />
      </section>
      <MaxWidthWrapper>
        {/* <section className="section_container">
          <p className="text-30-semibold">
            {query ? `Search result for ${query}` : "All Blogs"}
          </p>
          <ul className="mt-7 card_grid">
            {posts?.length > 0 ? (
              posts.map((post: StartupCardType) => (
                <StartupCard key={post._id} post={post} />
              ))
            ) : (
              <p className="no-result">Not found</p>
            )}
          </ul>
        </section> */}
        {/* <TrustSignals /> */}

        <Hero />
        <BlogHome blogs={blogs} />
        <Features />
      </MaxWidthWrapper>
    </div>
  );
}
