import Link from "next/link";
import DecryptedAnim from "@/components/feature-specific/util/DecryptedAnim";


export default function NotFound() {
    return (
        <div style={{ textAlign: "center", padding: "2rem"}} className="flex flex-col items-center justify-center min-h-screen">
            <div style={{ marginTop: '4rem' }}>
                <DecryptedAnim
                    text="404"
                    animateOn="view"
                    revealDirection="center"
                />
            </div>
            <p>This page could not be found.</p>
            <Link href="/">Go to homepage</Link>
        </div>
    );
}