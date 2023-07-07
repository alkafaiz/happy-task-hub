'use client';
import { useState } from 'react';
import Dropzone from '~/components/Dropzone';
import dynamic from 'next/dynamic';

const PreviewPanel = dynamic(() => import('~/components/PreviewPanel'), {
    ssr: false,
});

export default function Home() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const hasFile = selectedFiles.length > 0;

    const handleFiles = (files: File[]) => {
        setSelectedFiles(files);
    };

    return (
        <main className="">
            {hasFile ? (
                <section className="grid grid-cols-3 md:grid-cols-4 gap-3 min-h-screen">
                    <div className="col-span-1 border-r h-full px-3 flex flex-col bg-slate-50">
                        <h1 className="text-2xl font-bold my-6">Actions</h1>
                        <h3 className="text-xl my-2">Add file(s)</h3>
                        <Dropzone onChange={handleFiles} />
                        <div className="flex mt-auto">
                            <button className="mr-1 flex-1 text-xl bg-slate-500 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded my-2">
                                Reset
                            </button>
                            <button className="ml-1 flex-1 text-xl bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded my-2">
                                Confirm
                            </button>
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-3 p-3">
                        <h1 className="text-2xl font-bold my-6">Preview</h1>
                        <div
                            className="grid grid-cols-2 gap-3 overflow-y-auto"
                            style={{ height: 'calc(100vh - 110px)' }}
                        >
                            {selectedFiles.map((file) => (
                                <PreviewPanel key={file.name} file={file} />
                            ))}
                        </div>
                    </div>
                </section>
            ) : (
                <section className="container m-auto">
                    <h1 className="text-2xl font-bold my-6">Upload PDF(s)</h1>
                    <Dropzone onChange={handleFiles} />
                </section>
            )}
        </main>
    );
}
