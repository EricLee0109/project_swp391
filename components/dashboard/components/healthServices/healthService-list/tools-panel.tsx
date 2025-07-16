"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolsPanelProps {
  onSearch: (query: string) => void;
  onTypeChange: (type: string) => void;
}

const ToolsPanel = ({ onSearch, onTypeChange }: ToolsPanelProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="grid grid-cols-12 pb-5 gap-5">
      <div className="col-span-4 flex gap-3">
        <Input
          placeholder="Nhập để tìm kiếm"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            onSearch(value.trim());
          }}
        />
        <Button onClick={handleSearch}>
          <Search />
        </Button>
      </div>

      <div className="col-span-3"></div>

      <div className="col-span-3">
        <Select onValueChange={onTypeChange} defaultValue="*">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Loại dịch vụ" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="*">Tất cả</SelectItem>
            <SelectItem value="Consultation">Tư vấn</SelectItem>
            <SelectItem value="Testing">Xét nghiệm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* <div className="col-span-2 flex">
        <Link href={"/create-appointment"} className="w-full">
          <Button className="w-full flex gap-3 items-center">
            <Plus />
            Tạo mới
          </Button>
        </Link>
      </div> */}
    </div>
  );
};

export default ToolsPanel;
