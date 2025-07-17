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
  onRoleChange: (role: string) => void;
  onSpecializationChange: (spec: string) => void;
  specializationOptions: string[];
  onQualificationsChange: (qualification: string) => void;
  qualificationOptions: string[];
}

const ToolsPanel = ({
  onSearch,

  onSpecializationChange,
  onQualificationsChange,
  specializationOptions,
  qualificationOptions,
}: ToolsPanelProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="grid grid-cols-12 pb-5 gap-5">
      {/* Tìm kiếm */}
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

      {/* Bộ lọc trình độ */}
      <div className="col-span-3">
        <Select onValueChange={onQualificationsChange} defaultValue="*">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Trình độ" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="*">Tất cả</SelectItem>
            {qualificationOptions.map((q) => (
              <SelectItem key={q} value={q}>
                {q}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bộ lọc chuyên môn */}
      <div className="col-span-3">
        <Select onValueChange={onSpecializationChange} defaultValue="*">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chuyên môn" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="*">Tất cả</SelectItem>
            {specializationOptions.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nút tạo mới */}
      {/* <div className="col-span-2 flex">
        <Link href={"/create-user"} className="w-full">
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
