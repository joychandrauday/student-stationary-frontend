import { useState } from 'react';

const UserSetting = () => {
    const [userInfo, setUserInfo] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
    });

    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: true, // true for public, false for private
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
    });

    const handleSaveChanges = () => {
        // Logic to save the settings changes (could be a POST request to backend)
        alert('Settings Saved!');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Account Settings</h1>

            {/* Profile Settings */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Profile Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-600">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-600">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="profileVisibility" className="block text-gray-600">Profile Visibility</label>
                        <select
                            id="profileVisibility"
                            value={privacySettings.profileVisibility ? 'Public' : 'Private'}
                            onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value === 'Public' })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Notification Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={notificationSettings.emailNotifications}
                                onChange={() =>
                                    setNotificationSettings({
                                        ...notificationSettings,
                                        emailNotifications: !notificationSettings.emailNotifications,
                                    })
                                }
                                className="h-5 w-5"
                            />
                            <span className="text-gray-600">Email Notifications</span>
                        </label>
                    </div>
                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={notificationSettings.pushNotifications}
                                onChange={() =>
                                    setNotificationSettings({
                                        ...notificationSettings,
                                        pushNotifications: !notificationSettings.pushNotifications,
                                    })
                                }
                                className="h-5 w-5"
                            />
                            <span className="text-gray-600">Push Notifications</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSaveChanges}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default UserSetting;
