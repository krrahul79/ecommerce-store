"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: string;
  name: string;
  oldprice: string;
  newprice: string;
  calculateSize: string;
  //createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
  isOutOfStock: boolean;
  typeToDisplay: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isOutOfStock",
    header: "OutOfStock",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "oldprice",
    header: "Old Price",
  },
  {
    accessorKey: "newprice",
    header: "New Price",
  },
  {
    accessorKey: "calculateSize",
    header: "Calculate Size",
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Date",
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
