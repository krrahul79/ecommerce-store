import Link from "next/link";
import Image from "next/image";
import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";
import CategorySwitcher from "./category-switcher";

const Navbar = async () => {
  const categories = await getCategories();

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-2 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="ml-4 lg:ml-0 gap-x-2">
            <Image
              src="https://res.cloudinary.com/dur9jryl7/image/upload/v1707528275/WhatsApp_Image_2024-01-27_at_1.31.11_PM_1_kx8lqv.jpg"
              alt=""
              width={60}
              height={60}
              className="aspect-square object-cover rounded-md"
            />
          </Link>
          <div className="flex-grow flex justify-center">
            <CategorySwitcher items={categories} />
          </div>
          <Link href="/categories" className="ml-4">
            Create Category
          </Link>
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
