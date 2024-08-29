import React, { useState } from 'react';

const ImageUpload = () => {
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setMessage('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await fetch('http://127.0.0.1:8000/store/products/648/images/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setMessage('Image uploaded successfully!');
            } else {
                setMessage('Failed to upload image.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Upload Image</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ImageUpload;