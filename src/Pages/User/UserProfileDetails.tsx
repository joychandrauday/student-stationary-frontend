import { useState } from "react";
import { useUpdateUserMutation } from "@/Redux/features/user/userApi";
import { FaUserCircle } from "react-icons/fa";
import useUser from "@/Utils/useUser";
import useImageUpload from "@/Utils/useUplaodImages";

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
    const { uploadImages, isLoading: isImageUploading, error: imageUploadError } = useImageUpload();
    // Set state for editing avatar
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [newAvatarUrl, setNewAvatarUrl] = useState("");

    const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const uploadedUrls = await uploadImages(e.target.files);
            if (uploadedUrls.length > 0) {
                setNewAvatarUrl(uploadedUrls[0]);
            }
        }
    };
    // Set state for editing name
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.name || "");

    // Mutation to update the user's avatar and name
    const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation();

    const handleAvatarClick = () => {
        // Toggle the avatar editing state
        setIsEditingAvatar(!isEditingAvatar);
    };

    const handleAvatarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            console.error("User is null or undefined");
            return;
        }

        const updatedData = { avatar: newAvatarUrl };
        if (newAvatarUrl) {
            try {
                await updateUser({ userId: user._id, updatedData }).unwrap();
                setIsEditingAvatar(false); // Close the form after successful update
                window.location.reload();
            } catch (error) {
                console.error("Error updating avatar:", error);
            }
        }
    };

    const handleNameClick = () => {
        // Toggle the name editing state
        setIsEditingName(!isEditingName);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    const handleNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !newName) {
            console.error("User or name is null or undefined");
            return;
        }

        const updatedData = { name: newName };
        try {
            await updateUser({ userId: user._id, updatedData }).unwrap();
            setIsEditingName(false); // Close the form after successful update
            window.location.reload();
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    if (isLoading) return <div>Loading profile...</div>;
    if (updateError) return <div>Error loading profile!</div>;
    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center sm:text-left">
                Profile Details
            </h1>

            <div className="bg-white shadow-lg rounded-none p-4 sm:p-6 flex flex-col items-center">
                {/* Profile Picture */}
                <div
                    onClick={handleAvatarClick}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-3 sm:mb-4 object-cover cursor-pointer"
                >
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <FaUserCircle size={96} className="text-gray-500 sm:size-128" />
                    )}
                </div>

                {/* Avatar Update Form */}
                {isEditingAvatar && (
                    <form onSubmit={handleAvatarSubmit} className="flex flex-col items-center w-full">
                        <input
                            type="file"
                            name="featuredImages"
                            id="featuredImages"
                            onChange={handleFeaturedImageUpload}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {isImageUploading && <p className="text-green-500 text-sm mt-2">Finishing uploading...</p>}
                        {imageUploadError && <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>}

                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Updating..." : "Update Avatar"}
                        </button>
                        {updateError && (
                            <div className="text-red-500 mt-2 text-center">
                                {'status' in updateError ? `Error: ` : updateError}
                            </div>
                        )}
                    </form>
                )}

                {/* User Name Edit */}
                <div className="mt-4 sm:mt-6 text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        {isEditingName ? (
                            <form onSubmit={handleNameSubmit}>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={handleNameChange}
                                    className="w-full sm:w-3/4 p-2 border rounded-md mb-3"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Updating..." : "Update Name"}
                                </button>
                            </form>
                        ) : (
                            <div className="text-gray-700 font-semibold text-xl">{user.name}</div>
                        )}
                    </h2>
                    {!isEditingName && (
                        <button
                            onClick={handleNameClick}
                            className="text-blue-600 mt-2 hover:underline"
                        >
                            Edit Name
                        </button>
                    )}
                    <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
                    <p className="text-gray-600 text-sm sm:text-base">{user.phone}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfileDetails;
