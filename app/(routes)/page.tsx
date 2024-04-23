import getBillboard from "@/actions/get-billboard";
import getCategories from "@/actions/get-categories";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import CategoryList from "@/components/category-list";
import Container from "@/components/ui/container";
import CarouselBanner from "@/components/ui/corousel-banner";
import getBrands from "@/actions/get-brands";
import BrandList from "@/components/brand-list";

export const revalidate = 0;

const HomePage = async () => {
  const products = await getProducts({ isFeatured: true });
  const categories = await getCategories();
  const brands = await getBrands({ isFeatured: true });

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <CarouselBanner />
        {/* <Billboard data={billboard} /> */}
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <CategoryList title="Popular Categories" items={categories} />
        </div>
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Popular Products" items={products} />
        </div>
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <BrandList title="Popular Brands" items={brands} />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
