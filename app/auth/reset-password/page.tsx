import { Suspense } from "react";
import ResetPasswordPage from "./resetPass";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading reset password...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
