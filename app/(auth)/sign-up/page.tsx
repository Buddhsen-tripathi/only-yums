import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="section-container flex justify-center py-16">
      <SignUp />
    </div>
  );
}
