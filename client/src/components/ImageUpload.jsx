import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Card from './ui/Card';

const ImageUpload = ({ onImageSelect, onImageRemove, disabled }) => {
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, or WEBP)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Pass file to parent
        onImageSelect(file);
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onImageRemove();
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            {!preview ? (
                <Card
                    className={`p-8 border-2 border-dashed cursor-pointer transition-all duration-150 ${dragActive
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={!disabled ? handleClick : undefined}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <div className="flex flex-col items-center text-center">
                        <div className="p-4 bg-indigo-50 rounded-full mb-4">
                            <Upload className="w-8 h-8 text-indigo-600" />
                        </div>
                        <p className="text-gray-900 font-medium mb-2">
                            Drop image here or click to upload
                        </p>
                        <p className="text-sm text-gray-500">
                            Supports: JPG, PNG, WEBP (Max 5MB)
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Perfect for WhatsApp screenshots!
                        </p>
                    </div>
                </Card>
            ) : (
                <Card className="p-4">
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full rounded-xl max-h-96 object-contain bg-gray-100"
                        />
                        {!disabled && (
                            <button
                                onClick={handleRemove}
                                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-md"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ImageUpload;
