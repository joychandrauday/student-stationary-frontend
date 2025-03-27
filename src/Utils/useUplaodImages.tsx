/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

const useImageUpload = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImages = async (files: FileList): Promise<string[]> => {
        const uploadedImages: string[] = [];
        if (files.length === 0) {
            throw new Error('At least one image is required');
        }

        setIsLoading(true);
        setError(null);

        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append('upload_preset', 'product_images');
                formData.append('cloud_name', 'dklikxmpm');

                const res = await fetch("https://api.cloudinary.com/v1_1/dklikxmpm/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                if (res.ok) {
                    uploadedImages.push(data.secure_url);
                } else {
                    throw new Error('Failed to upload image to Cloudinary');
                }
            }
            return uploadedImages;
        } catch (err: any) {
            setError(err.message || 'An error occurred during the image upload');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    return { uploadImages, isLoading, error };
};

export default useImageUpload;
