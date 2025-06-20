import {Searchbar} from "@/components/common/Searchbar";
import {CartButton} from "@/components/feature-specific/cart/CartButton";
import {SignInButton} from "@/components/feature-specific/sign-in/SignInButton";
import Link from "next/link";
import {NavbarCategories} from "@/components/common/NavbarCategories";
import Image from "next/image";


export const Navbar = () => {
    return (
        <section>
            <div>
                <nav className="fixed w-full px-8 py-4 h-32">
                    {/* Navbar Container */}
                    <div className="z-10 h-full w-full flex justify-between items-center bg-primary-foreground rounded-lg px-8 shadow-lg outline-1 outline-border">
                        <div className="">
                            {/* Logo and brand name */}
                            <Link href="/">
                                <Image src="/images/logo.png" alt="Sovereign Logo" width={50} height={50}/>
                            </Link>
                        </div>
                        <div className="flex-grow flex justify-center">
                            {/* Search bar */}
                            <Searchbar/>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Sign in and cart */}
                            <SignInButton/>
                            <CartButton/>
                        </div>
                    </div>

                    <div className="z-0 w-4/5 bg-background rounded-b-lg mx-auto shadow-md">
                        <div className="flex flex-row justify-center items-center mx-auto py-2">
                            <NavbarCategories/>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
}