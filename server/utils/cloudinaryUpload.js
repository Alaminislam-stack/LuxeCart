import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const extractPublicId = (imageUrl) => {
    if (!imageUrl) return null;
    
    const urlParts = imageUrl.split('/upload/');
    if (urlParts.length < 2) return null;
    
    const pathAfterUpload = urlParts[1];
    
    const versionMatch = pathAfterUpload.match(/^v\d+\/(.*)$/);
    if (versionMatch && versionMatch[1]) {
        const publicIdWithExtension = versionMatch[1];
        
        const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            return publicIdWithExtension.substring(0, lastDotIndex);
        }
        return publicIdWithExtension;
    }
    
    return null; 
};

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
            folder: "e-commerce",
        })
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) 
    }
}

export const deleteFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;

    try {
        const publicId = extractPublicId(imageUrl);

        if (!publicId) {
            console.warn(`Could not extract Public ID from URL: ${imageUrl}`);
            return;
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image'
        });


        if (result.result !== 'ok' && result.result !== 'not found') {
            console.error(`Cloudinary delete failed for ${publicId}:`, result);
        }

    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
    }
};

export { uploadOnCloudinary }