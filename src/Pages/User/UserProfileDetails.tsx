import { useState } from "react";
import { useUpdateUserMutation } from "@/Redux/features/user/userApi";
import { FaUserCircle } from "react-icons/fa";
import useUser from "@/Utils/useUser";

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string; // Add the avatar property
}

const UserProfileDetails = () => {
    // Get user details using the custom `useUser` hook
    const { user, isLoading } = useUser(undefined) as { user: User | null, isLoading: boolean };

    // Set state for editing avatar
    const [isEditing, setIsEditing] = useState(false);
    const [newAvatarUrl, setNewAvatarUrl] = useState("");

    // Mutation to update the user's avatar
    const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation();

    const handleAvatarClick = () => {
        // Toggle the avatar editing state
        setIsEditing(!isEditing);
    };

    const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAvatarUrl(e.target.value);
    };

    const handleAvatarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            console.error("User is null or undefined");
            return;
        }

        const updatedData = {

            avatar: newAvatarUrl,
        }
        if (newAvatarUrl) {
            // Update the avatar URL using the mutation
            try {
                await updateUser({ userId: user._id, updatedData }).unwrap();
                setIsEditing(false); // Close the form after successful update
                window.location.reload();

            } catch (error) {
                console.error("Error updating avatar:", error);
            }
        }
    };

    if (isLoading) return <div>Loading profile...</div>;
    if (updateError) return <div>Error loading profile!</div>;
    if (!user) {
        return <div>User not found.</div>; // This handles the case when user is null or undefined
    }
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Profile Details</h1>

            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
                {/* Profile Picture */}
                <div
                    onClick={handleAvatarClick}
                    className="w-32 h-32 rounded-full mb-4 object-cover cursor-pointer"
                >
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <FaUserCircle size={128} className="text-gray-500" />
                    )}
                </div>

                {/* Avatar Update Form */}
                {isEditing && (
                    <form onSubmit={handleAvatarSubmit} className="flex flex-col items-center">
                        <input
                            type="url"
                            placeholder="Enter Avatar URL"
                            value={newAvatarUrl}
                            onChange={handleAvatarUrlChange}
                            className="mb-4 p-2 border rounded-md"
                            required
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Updating..." : "Update Avatar"}
                        </button>
                        {updateError && (
                            <div className="text-red-500 mt-2">
                                {'status' in updateError ? `Error: ` : updateError}
                            </div>
                        )}
                    </form>
                )}

                {/* User Details */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.phone}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfileDetails;
