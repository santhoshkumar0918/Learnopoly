import Feed from "../components/Feed/Feed";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  return (
    <div>
      
      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {isLoaded && user ? user.firstName : "Guest"}
        </h1>
        <Feed />
      </div>
    </div>
  );
 }
// // app/dashboard/page.tsx

// import dynamic from "next/dynamic";
// import { useUser } from "@clerk/nextjs";

// // Dynamically import the Feed component to ensure it's client-side
// const Feed = dynamic(() => import("../components/Feed/Feed"), {
//   ssr: false, // Disable server-side rendering for Feed component
// });

// export default function Dashboard() {
//   const { user, isLoaded } = useUser();

//   return (
//     <div>
//       <div className="max-w-2xl mx-auto mt-8">
//         <h1 className="text-3xl font-bold mb-4">
//           Welcome, {isLoaded && user ? user.firstName : "Guest"}
//         </h1>

//         {/* Conditionally render Feed only after user is loaded */}
//         {isLoaded && user ? <Feed /> : <p>Loading your feed...</p>}
//       </div>
//     </div>
//   );
// }
