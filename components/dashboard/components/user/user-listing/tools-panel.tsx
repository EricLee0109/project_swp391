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
}

const ToolsPanel = ({ onSearch, onRoleChange }: ToolsPanelProps) => {
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
        <Select onValueChange={onRoleChange} defaultValue="*">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="*">Tất cả</SelectItem>
            <SelectItem value="Customer">Khách hàng</SelectItem>
            <SelectItem value="Staff">Nhân viên</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Consultant">Tư vấn viên</SelectItem>
            <SelectItem value="Manager">Quản lý</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
