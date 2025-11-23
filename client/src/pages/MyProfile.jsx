import { useAuth } from "../context/AuthContext";

export default function MyProfile() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading your profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          My Profile
        </h1>

        <div className="space-y-5 text-lg">

          <div>
            <p className="font-semibold">Name</p>
            <p className="text-gray-800">{user.name}</p>
          </div>

          <div>
            <p className="font-semibold">Email</p>
            <p className="text-gray-800">{user.email}</p>
          </div>

          {user.createdAt && (
            <div>
              <p className="font-semibold">Joined On</p>
              <p className="text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
