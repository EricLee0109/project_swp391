"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ToolsPanelProps {
  onSearch: (query: string) => void;
}

const ToolsPanel = ({ onSearch }: ToolsPanelProps) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value.trim());
  };

  return (
    <div className="grid grid-cols-12 pb-5 gap-5">
      {/* Tìm kiếm */}
      <div className="col-span-4 flex gap-3">
        <Input
          placeholder="Nhập để tìm kiếm"
          value={query}
          onChange={handleInputChange}
        />
        <Button onClick={() => onSearch(query.trim())}>
          <Search />
        </Button>
      </div>

      {/* Bộ lọc trình độ */}
      <div className="col-span-3">
     
      </div>

      {/* Bộ lọc chuyên môn */}
      <div className="col-span-3">
     
      </div>
    </div>
  );
};

export default ToolsPanel;
