import Container from "@/components/ui/container";
import Billboard from "@/components/ui/billboard";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";

import getProducts from "@/actions/get-products";
import getCategory from "@/actions/get-category";

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    brandId: string;
  };
}
//Adding a comment
const BrandPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const products = await getProducts({
    brandId: params.brandId,
  });
  // const category = await getCategory(params.categoryId);

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {products.length === 0 && <NoResults />}
              <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-4">
                {products.map((item) => (
                  <ProductCard key={item._id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BrandPage;
