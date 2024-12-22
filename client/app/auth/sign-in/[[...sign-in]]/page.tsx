// import { SignIn } from "@clerk/nextjs";

// export default function SignInPage() {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
//     </div>
//   );
// }
// app/auth/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-teal-400 hover:bg-teal-500',
            headerTitle: 'text-slate-300',
            headerSubtitle: 'text-slate-400',
            formFieldLabel: 'text-slate-300',
            formFieldInput: 'bg-gray-800 text-slate-300 border-gray-700',
          }
        }}
      />
    </div>
  );
}