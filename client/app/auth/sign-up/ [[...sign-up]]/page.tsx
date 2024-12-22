// import { SignUp } from "@clerk/nextjs";

// export default function SignUpPage() {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
//     </div>
//   );
// }
// app/auth/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <SignUp 
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