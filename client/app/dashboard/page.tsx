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
