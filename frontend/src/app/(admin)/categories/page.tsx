"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFindAllCategories } from "@/hooks/category.hook";

export default function CategoriesPage() {
  const { data: categories } = useFindAllCategories();
  const dataCategory = categories ?? [];
  return (
    <>
      <div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="w-25">No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataCategory.map((data, i) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">{i + 1}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell className="text-right">Action</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
