import Link from "next/link";
import Image from "next/image";
import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";
import CategorySwitcher from "./category-switcher";
import { auth } from "@clerk/nextjs";
import styles from "./navbar.module.css";

const Navbar = async () => {
  const categories = await getCategories();

  //console.log(" auth()", auth());
  const { userId } = auth();

  const list = ["user_2f4LxPVnULRzrVerGOzrBFlondZ"];
  let isAdmin = false;
  if (userId !== null) {
    isAdmin = list.includes(userId);
  } else {
    console.log("User ID is not available");
  }

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-2 sm:px-6 lg:px-8 flex h-20 items-center">
          <Link href="/" className="mr-4 lg:mr-0 flex-shrink-0">
            <Image
              src="https://res.cloudinary.com/dur9jryl7/image/upload/v1713725249/bbwmvtwcipvnqjay965a.png"
              alt=""
              height={80}
              width={200}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="zoom-image group"
            />
          </Link>
          <div className="flex-grow flex justify-center">
            <CategorySwitcher items={categories} />
          </div>
          <NavbarActions isAdmin={isAdmin} />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
