import Link from "next/link";
import {Button} from "@/components/ui/button";


export const SignInButton = () => {
    return (
    <Button asChild>
        <Link href="/auth/login">
            Sign In
        </Link>
    </Button>
    )
}