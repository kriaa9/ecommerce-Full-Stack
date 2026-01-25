package com.ecommerce.backend.service;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;


    /**
     * Upload image to Cloudinary
     * @param file - The image file to upload
     * @param folder - The folder in Cloudinary (e.g., "profile_photos")
     * @return Map containing url and public_id
     */
    public Map<String, String> uploadImage(MultipartFile file, String folder) throws IOException {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }
        // Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "image",
                        "transformation", new com.cloudinary.Transformation()
                                .width(500).height(500).crop("limit").quality("auto")
                )
        );
        // Extract URL and public ID
        String url = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");
        log.info("Image uploaded successfully. Public ID: {}", publicId);
        return Map.of(
                "url", url,
                "publicId", publicId
        );
    }

    /**
     * Delete image from Cloudinary
     * @param publicId - The public ID of the image to delete
     */
    public void deleteImage(String publicId) throws IOException {
        if (publicId == null || publicId.isEmpty()) {
            return;
        }
        Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        log.info("Image deleted. Public ID: {}, Result: {}", publicId, result.get("result"));
    }
}
