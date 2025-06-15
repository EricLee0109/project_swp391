import SearchFormReset from "@/components/SearchFormReset";
import { SearchIcon } from "lucide-react";
import Form from "next/form";

export default function SearchForm({ query }: { query?: string }) {
  return (
    <Form action="/" scroll={false} className="search-form">
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search your symtoms, diseases, or blogs"
        type="text"
      />
      <div className="flex gap-2">
        {query && <SearchFormReset />}
        <button type="submit" className="search-btn">
          <SearchIcon className="size-5" />
        </button>
      </div>
    </Form>
  );
}
