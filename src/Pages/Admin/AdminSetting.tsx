
const AdminSetting = () => {
    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen space-y-6">
            {/* Page Header */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-blue-400">Admin Settings</h1>
                <p className="text-gray-400">Manage your preferences and settings</p>
            </header>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* Account Settings */}
                <div className="bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-blue-400 mb-4">Account Settings</h2>
                    <div className="space-y-4">
                        {/* Change Username */}
                        <div>
                            <label className="block text-gray-400 mb-2">Username</label>
                            <input
                                type="text"
                                placeholder="Enter new username"
                                className="w-full bg-gray-700 p-3 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        {/* Change Email */}
                        <div>
                            <label className="block text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="Enter new email"
                                className="w-full bg-gray-700 p-3 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        {/* Save Button */}
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-blue-400 mb-4">Notification Settings</h2>
                    <div className="space-y-4">
                        {/* Email Notifications */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Email Notifications</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-500 transition-all"></div>
                                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transform transition-all"></span>
                            </label>
                        </div>
                        {/* Push Notifications */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Push Notifications</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-500 transition-all"></div>
                                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transform transition-all"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-blue-400 mb-4">Privacy Settings</h2>
                    <div className="space-y-4">
                        {/* Profile Visibility */}
                        <div>
                            <label className="block text-gray-400 mb-2">Profile Visibility</label>
                            <select
                                className="w-full bg-gray-700 p-3 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                                <option value="only-me">Only Me</option>
                            </select>
                        </div>
                        {/* Save Button */}
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
                            Update Privacy
                        </button>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div className="bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-blue-400 mb-4">Appearance Settings</h2>
                    <div className="space-y-4">
                        {/* Theme Selector */}
                        <div>
                            <label className="block text-gray-400 mb-2">Theme</label>
                            <select
                                className="w-full bg-gray-700 p-3 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="default">Default</option>
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                        {/* Font Size Selector */}
                        <div>
                            <label className="block text-gray-400 mb-2">Font Size</label>
                            <select
                                className="w-full bg-gray-700 p-3 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                        {/* Save Button */}
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
                            Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSetting;
