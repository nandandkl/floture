// export default function Page() {
//   return (
//     <div className="w-full max-w-md mx-auto text-center p-10">
//       <h2 className="text-2xl font-bold">Verify your email</h2>
//       <p className="mt-3 text-muted-foreground">
//         We've sent you a verification link. Please check your email.
//       </p>
//     </div>
//   );
// }


import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="w-full max-w-md mx-auto text-center p-10">
      <h2 className="text-2xl font-bold">VERIFY YOUR EMAIL</h2>
      <p className="mt-3 text-muted-foreground">
        We've sent you a verification link. Please check your email.
      </p>

      <div className="mt-6">
        <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`}>
          <Button variant="outline" className="w-full bg-primary/10 border border-primary/30 hover:bg-primary/25 transition-all duration-300">
            <p className="text-muted-foreground">GO TO LOGIN</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}