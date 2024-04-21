import { CategoryForm } from "./components/category-form";

import { Category } from "@/types";
import clientPromise from "@/lib/mongodb";

import { Document, ObjectId, WithId } from "mongodb";

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const client = await clientPromise;
  const db = client.db("Kerafresh");
  let category: Category | null = null;
  console.log("params", params.categoryId);
  if (params.categoryId !== undefined && params.categoryId !== "new") {
    category = (await db
      .collection("Categories")
      .findOne({ _id: new ObjectId(params.categoryId) })) as Category | null;
  } else {
    category = null;
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
