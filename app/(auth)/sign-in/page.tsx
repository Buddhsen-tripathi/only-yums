import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="section-container flex justify-center py-16">
      <SignIn />
    </div>
  );
}
