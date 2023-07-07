'use client';
import { useEffect, useState } from 'react';
import Dropzone from '~/components/Dropzone';
import dynamic from 'next/dynamic';
import { DEFAULT_VALUES } from '~/libs/constants';
import { Modification } from '~/libs/types';
import { addRemarkToDocument } from '~/libs/modifyPdf';

const PreviewPanel = dynamic(() => import('~/components/PreviewPanel'), {
    ssr: false,
});

export default function Home() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [results, setResults] = useState<File[]>([]);
    const [modifications, setModifications] = useState<Modification[]>([]);
    const [openPanel, setOpenPanel] = useState<'preview' | 'results'>('preview');

    const hasFile = selectedFiles.length > 0;
    const hasResult = results.length > 0;

    const handleFiles = (files: File[]) => {
        setSelectedFiles(files);
        setModifications(
            files.map((file) => ({
                filename: file.name,
                remark: { text: '', ...DEFAULT_VALUES.remarkPosition },
                remarkSize: { ...DEFAULT_VALUES.remarkSize },
            }))
        );
    };

    useEffect(() => {
        console.log(modifications);
    }, [modifications]);

    const handleModificationChange = (index: number, modification: Modification) => {
        setModifications((prev) => {
            const newModifications = [...prev];
            newModifications[index].filename = modification.filename;
            newModifications[index].remark.text = modification.remark.text;
            newModifications[index].remark.x = modification.remark.x;
            newModifications[index].remark.y = modification.remark.y;
            newModifications[index].remarkSize.width = modification.remarkSize.width;
            newModifications[index].remarkSize.height = modification.remarkSize.height;

            return newModifications;
        });
    };

    const handleSubmit = async () => {
        console.log('submit');

        const newFiles = [];

        for (const [index, file] of selectedFiles.entries()) {
            const modification = modifications[index];
            const filename = modification.filename;
            const remark = modification.remark.text;
            const remarkPosition = modification.remark;
            const remarkSize = modification.remarkSize;

            const fileArrayBuffer = await file.arrayBuffer();

            const added = await addRemarkToDocument(fileArrayBuffer, remark, {
                x: remarkPosition.x,
                y: remarkPosition.y,
                remarkWidth: remark ? remarkSize.width : 0,
                remarkHight: remark ? remarkSize.height : 0,
            });
            const pdfBlob = new Blob([new Uint8Array(added)], {
                type: 'document/pdf',
            });
            const newFile = new File([pdfBlob], filename, { type: 'document/pdf' });
            newFiles.push(newFile);
        }

        setResults(newFiles);
        setOpenPanel('results');
    };

    const handleReset = () => {
        setSelectedFiles([]);
        setResults([]);
        setModifications([]);
        setOpenPanel('preview');
    };

    const handleDownloadAll = () => {
        for (const file of results) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = file.name;
            link.click();
        }
    };

    return (
        <main className="">
            {hasFile ? (
                <section className="grid grid-cols-3 md:grid-cols-4 gap-3 min-h-screen">
                    <div className="col-span-1 border-r h-full px-3 flex flex-col bg-slate-50">
                        <h1 className="text-2xl font-bold my-6">Actions</h1>
                        {hasResult ? (
                            <>
                                <h2 className="text-2xl font-bold my-2 text-green-500">Complete!</h2>
                                <h3 className="text-xl my-2">
                                    Download {results.length} {results.length ? 'files' : 'file'}
                                </h3>
                                <section className="bg-blue-200 py-1 px-2">
                                    <ol>
                                        {results.map((file, index) => (
                                            <li key={file.name}>
                                                <a className='text-blue-800 hover:text-blue-900 hover:underline cursor-pointer'
                                                href={URL.createObjectURL(file)} download={file.name} title={`Click to download ${file.name}`}>
                                                    {file.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ol>
                                </section>
                                <div className="flex flex-col">
                                    <button
                                        onClick={handleDownloadAll}
                                        className="flex-1 text-xl bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-4 rounded my-2"
                                    >
                                        Download all
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl my-2">Add file(s)</h3>
                                <Dropzone onChange={handleFiles} />
                            </>
                        )}
                        <div className="flex mt-auto">
                            <button
                                onClick={handleReset}
                                className="mr-1 flex-1 text-xl bg-slate-500 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded my-2"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="ml-1 flex-1 text-xl bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded my-2"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-3 p-3">
                        <h1 className="text-2xl font-bold my-6">
                            Preview{' '}
                            {openPanel === 'results' && (
                                <button
                                    onClick={() => setOpenPanel('preview')}
                                    className="text-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-500 px-2 rounded-full"
                                >
                                    {'>'}
                                </button>
                            )}
                        </h1>
                        <div
                            className={`grid grid-cols-2 gap-3 overflow-y-auto ${
                                openPanel === 'results' ? 'hidden' : ''
                            }`}
                            style={{ height: `calc(100vh - ${hasResult ? '190' : '110'}px)` }}
                        >
                            {selectedFiles.map((file, index) => (
                                <PreviewPanel
                                    key={file.name}
                                    file={file}
                                    index={index}
                                    onChange={handleModificationChange}
                                />
                            ))}
                        </div>
                        {hasResult && (
                            <>
                                <hr className={`mr-3 ${openPanel === 'preview' ? 'hidden' : ''}`} />
                                <h1 className="text-2xl font-bold my-6 text-green-600">
                                    Results{' '}
                                    {openPanel === 'preview' && (
                                        <button
                                            onClick={() => setOpenPanel('results')}
                                            className="text-xl bg-green-200 hover:bg-green-300 font-bold text-green-500 px-2 rounded-full"
                                        >
                                            {'>'}
                                        </button>
                                    )}
                                </h1>
                            </>
                        )}
                        <div
                            className={`grid grid-cols-2 gap-3 overflow-y-auto ${
                                hasResult && openPanel === 'results' ? '' : 'hidden'
                            }`}
                            style={{ height: 'calc(100vh - 190px)' }}
                        >
                            {results.map((file, index) => (
                                <PreviewPanel key={file.name} file={file} index={index} />
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
