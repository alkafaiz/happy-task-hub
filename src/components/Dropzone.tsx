'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
    onChange: (acceptedFiles: File[]) => void;
}

function Dropzone({ onChange }: DropzoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            // Do something with the files
            const files = [];
            acceptedFiles.forEach((file: File) => {
                const reader = new FileReader();

                reader.onabort = () => console.log('file reading was aborted');
                reader.onerror = () => console.log('file reading has failed');
                reader.onload = () => {
                    // Do whatever you want with the file contents
                    const binaryStr = reader.result;
                    console.log(binaryStr);
                };
                reader.readAsArrayBuffer(file);
            });
            onChange(acceptedFiles);
        },
        [onChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            'application/pdf': ['.pdf'],
        },
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div
                className={`p-4 border-2 rounded border-blue-500 bg-blue-300 flex justify-center items-center h-56 w-full text-blue-900 border-dashed ${
                    isDragActive ? 'bg-blue-400' : ''
                }`}
            >
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop some files here, or click to select files</p>
                )}
            </div>
        </div>
    );
}

export default Dropzone;
