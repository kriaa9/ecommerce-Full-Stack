import {useState} from 'react';

/**
 * ImageUpload - Reusable image picker with preview
 * @param {string} currentImage - URL of current image if editing
 * @param {Function} onImageSelect - Callback when file is chosen
 */
const ImageUpload = ({currentImage, onImageSelect}) => {
    const [preview, setPreview] = useState(currentImage);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onImageSelect(file);
        }
    };

    return (
        <div className="image-upload-wrapper">
            <div className="image-dropzone" style={{
                border: '2px dashed #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#f8fafc',
                height: '250px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
            }} onClick={() => document.getElementById('image-input-hidden').click()}>

                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
                    />
                ) : (
                    <div style={{color: '#94a3b8'}}>
                        <span style={{fontSize: '2rem'}}>🖼️</span>
                        <p style={{marginTop: '0.5rem', fontSize: '0.875rem'}}>Click to upload image</p>
                    </div>
                )}

                <input
                    type="file"
                    id="image-input-hidden"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {preview && (
                <button
                    type="button"
                    className="btn-link"
                    style={{
                        mt: '0.5rem',
                        color: '#3b82f6',
                        fontSize: '0.875rem',
                        background: 'none',
                        border: 'none',
                        padding: 0
                    }}
                    onClick={() => document.getElementById('image-input-hidden').click()}
                >
                    Change Image
                </button>
            )}
        </div>
    );
};

export default ImageUpload;
