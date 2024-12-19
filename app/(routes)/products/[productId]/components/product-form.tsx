"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import React from "react";
//import { Category, Image, Product } from "@lib/uti";
import { Plus, Minus } from "lucide-react";

import { Category, CategoryArray, ChildProduct, Product } from "@/types";
import { useParams, useRouter } from "next/navigation";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import makeAnimated from "react-select/animated";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  _id: z.string().min(1),
  name: z.string().min(1),
  images: z.string().array(),
  oldprice: z.coerce.number().min(0),
  newprice: z.coerce.number().min(1),
  calculateSize: z.coerce.number().min(1),
  priority: z.coerce.number().min(1),
  categoryIds: z.string().array(),
  typeToDisplay: z.string().min(1),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  isOutOfStock: z.boolean().default(false),
});

//type ProductFormValues = z.infer<typeof formSchema>;

type ProductFormValues = z.infer<typeof formSchema> & {
  childProducts: {
    newprice: string;
    oldprice: string;
    calculateSize: string;
    showSize: string;
    isChildProduct: boolean;
  }[];
};

interface ProductFormProps {
  initialData:
    | (Product & {
        images: string[];
        categoryIds: string[];
        childProducts: ChildProduct[];
      })
    | null;
  categories: CategoryArray[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  initialData,
}) => {
  //console.log("categories in productform", categories);
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? {
        ...initialData,
        newprice: parseFloat(String(initialData?.newprice)),
        oldprice: parseFloat(String(initialData?.oldprice)),
        calculateSize: parseInt(String(initialData?.calculateSize)),
      }
    : {
        _id: "",
        name: "",
        images: [],
        oldprice: 0,
        newprice: 0,
        calculateSize: 0,
        priority: 999,
        typeToDisplay: "WEIGHT",
        categoryIds: [],
        isFeatured: false,
        isArchived: false,
        isOutOfStock: false,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      childProducts: initialData?.childProducts?.map((product) => ({
        _id: product._id,
        newprice: product.newprice,
        oldprice: product.oldprice,
        showSize: product.showSize,
        calculateSize: product.calculateSize,
        isChildProduct: true,
      })),
    },
  });

  const animatedComponents = makeAnimated();

  const onSubmit = async (data: ProductFormValues) => {
    console.log("Inside onsubmit", data);

    try {
      setLoading(true);
      const formData = {
        ...data, // Include other form data
        childProducts: form.getValues("childProducts"), // Get childProducts from the form
      };
      if (initialData) {
        console.log("initialData", formData);
        await axios.patch(`/api/products/${params.productId}`, formData);
      } else {
        await axios.post(`/api/products`, formData);
      }
      router.refresh();
      router.push(`/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${params.productId}`);
      router.refresh();
      router.push(`/products`);
      toast.success("Product deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const { control, setValue, watch } = form;
  const childProducts = watch("childProducts");

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oldprice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newprice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> New Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calculateSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calculate Size</FormLabel>
                  <FormControl>
                    <Input
                      type="calculateSize"
                      disabled={loading}
                      placeholder="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeToDisplay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WEIGHT/LITRES</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="typeToDisplay"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  {/* <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}

                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    defaultValue={field.value.map((categoryId) =>
                      categories.find(
                        (category) => category.value === categoryId
                      )
                    )}
                    isMulti
                    options={categories}
                    onChange={(selectedOptions) => {
                      // Update field.value with the selected category IDs
                      field.onChange(
                        selectedOptions
                          .map((option) => option?.value)
                          .filter(Boolean) as string[]
                      );
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="priority"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isOutOfStock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Out of stock</FormLabel>
                    <FormDescription>
                      This product will be shown as out of stock.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div>
            {childProducts &&
              childProducts.length > 0 &&
              childProducts.map((childProduct, index) => (
                <div className="md:grid md:grid-cols-4 gap-8" key={index}>
                  <FormField
                    control={form.control}
                    name={`childProducts.${index}.newprice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Newprice</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="newprice"
                            value={childProduct.newprice}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`childProducts.${index}.oldprice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oldprice</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="oldprice"
                            value={childProduct.oldprice}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`childProducts.${index}.showSize`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ShowSize</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="showSize"
                            value={childProduct.showSize}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`childProducts.${index}.calculateSize`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CalculateSize</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="calculateSize"
                            value={childProduct.calculateSize}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
