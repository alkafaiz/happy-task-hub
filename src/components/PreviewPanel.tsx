"use client"
import React, { useRef, useState } from 'react';
import RemarkStamp from './RemarkStamp';
import { Document, Page, Thumbnail, pdfjs } from 'react-pdf';

interface PreviewPanelProps {
    file: File;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// get today date in format DD.MM.YYYY
const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

function PreviewPanel({ file }: PreviewPanelProps) {
    const [remark, setRemark] = useState(today);
    const [filename, setFilename] = useState(file.name);
    const [remarkPosition, setRemarkPosition] = useState({ x: 50, y: 5 });

    const remarkRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative border bg-gray-100 p-3">
            <RemarkStamp ref={remarkRef} remark={remark} positionX={remarkPosition.x} positionY={remarkPosition.y} />
            <Document file={file}>
                <Thumbnail width={508} pageNumber={1} />
            </Document>
            <div
                style={{
                    width: 'calc(100% - 1.5rem)',
                    backgroundColor: 'rgba(255,0,100,0.9)',
                }}
                className="absolute bottom-3 grid h-32 grid-cols-2 gap-2 p-1"
            >
                <div>
                    <div>rename here:</div>
                    <input type="text" name="filename" value={filename} onChange={(e) => setFilename(e.target.value)} />
                </div>

                <div>
                    <div>Edit stamp mark:</div>
                    <input type="text" name="remark" value={remark} onChange={(e) => setRemark(e.target.value)} />
                    <div className="mt-1 flex">
                        <div>Pos X:</div>
                        <input
                            type="number"
                            className="w-14"
                            name="positionX"
                            value={remarkPosition.x}
                            onChange={(e) => {
                                setRemarkPosition({
                                    ...remarkPosition,
                                    x: Number(e.target.value),
                                });
                            }}
                        />
                        <div>Pos Y:</div>
                        <input
                            type="number"
                            className="w-14"
                            name="positionY"
                            value={remarkPosition.y}
                            onChange={(e) => {
                                setRemarkPosition({
                                    ...remarkPosition,
                                    y: Number(e.target.value),
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreviewPanel;
