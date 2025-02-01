/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAllUsersQuery } from '@/Interfaces/types';
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '@/Redux/features/user/userApi';
import { FaEye, FaEdit, FaTrash, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdminUserManagement = () => {
    const { data: users, error, isLoading, refetch } = useGetUsersQuery<useAllUsersQuery>(undefined);
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const handleDelete = async (userId: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const res = await deleteUser(userId).unwrap();
                console.log(res);
                Swal.fire("Deleted!", "User has been deleted.", "success");
                refetch();
            } catch (error) {
                Swal.fire("Error!", "Failed to delete user.", "error");
            }
        }
    };

    const handleUpdate = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "blocked" : "active";

        try {
            await updateUser({ userId, updatedData: { status: newStatus } });
            Swal.fire("Updated!", "User status updated successfully.", "success");
            refetch();
        } catch (error) {
            Swal.fire("Error!", "Failed to update user.");

        }
    };

    return (
        <div className="p-6 space-y-6 text-primary w-full">
            {/* Page Header */}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
            </header>

            {isLoading && <p className="text-center text-lg">Loading users...</p>}
            {error && <p className="text-center text-red-500">Failed to load users.</p>}

            <div className="overflow-x-auto shadow-md rounded-none">
                <table className="min-w-full table">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold">Name</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold">Email</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold">Role</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold">Status</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td className="py-4 px-4 text-sm">{user.name}</td>
                                    <td className="py-4 px-4 text-sm">{user.email}</td>
                                    <td className="py-4 px-4 text-sm">{user.role}</td>
                                    <td className="py-4 px-4 text-sm">
                                        <button

                                            className={`px-3 py-1 rounded-full text-sm ${user.status === "active"
                                                ? "bg-green-200 text-green-800"
                                                : "text-red-200 bg-red-900"
                                                }`}
                                        >
                                            {user.status}
                                        </button>
                                    </td>
                                    <td className="py-4 px-4 text-sm">
                                        <div className="flex space-x-3">
                                            <button
                                                title={user.status === 'active' ? "Block User" : "Unblock User"}
                                                onClick={() => handleUpdate(user._id, user.status)}
                                                className="text-primary hover:text-blue-700">
                                                {
                                                    user.status === 'active' ? <FaEyeSlash size={18} /> : <FaEye size={18} />
                                                }

                                            </button>
                                            <button className="text-yellow-500 hover:text-yellow-700">
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user?._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-sm text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManagement;
