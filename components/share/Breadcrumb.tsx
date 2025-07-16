"use client";

import { MdKeyboardArrowRight } from "react-icons/md";
import React from "react";
import MaxWidthWrapper from "../profile/MaxWidthWrapper";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <nav
      aria-label="breadcrumb"
      className="p-3 uppercase font-bold border-b border-black"
    >
      <MaxWidthWrapper>
        <ul className="flex gap-3 justify-center items-center">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <li>
                {index < items.length - 1 ? (
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
              {index < items.length - 1 && (
                <MdKeyboardArrowRight className="h-5 w-5" />
              )}
            </React.Fragment>
          ))}
        </ul>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Breadcrumb;
