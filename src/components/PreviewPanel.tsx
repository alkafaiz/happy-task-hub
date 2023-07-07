'use client';
import React, { useEffect, useRef, useState } from 'react';
import RemarkStamp from './RemarkStamp';
import { Document, Page, Thumbnail, pdfjs } from 'react-pdf';
import { DEFAULT_VALUES } from '~/libs/constants';
import { Modification } from '~/libs/types';

interface PreviewPanelProps {
    file: File;
    index: number;
    onChange?: (index: number, modification: Modification) => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function PreviewPanel({ file, onChange, index }: PreviewPanelProps) {
    const [remark, setRemark] = useState(DEFAULT_VALUES.remark);
    const [filename, setFilename] = useState(file.name);
    const [remarkPosition, setRemarkPosition] = useState(DEFAULT_VALUES.remarkPosition);

    const remarkRef = useRef<HTMLDivElement>(null);

    const isEditing = !!onChange;

    useEffect(() => {
        if (!remarkRef.current) return;

        if (!onChange) return;

        // TODO: can wrap this in a debounce function
        onChange(index, {
            filename,
            remark: {
                text: remark,
                x: remarkPosition.x,
                y: remarkPosition.y,
            },
            remarkSize: {
                width: remarkRef.current.offsetWidth,
                height: remarkRef.current.offsetHeight,
            },
        });
    }, [remarkPosition.x, remarkPosition.y, remark, filename]);

    return (
        <div className="relative border bg-gray-100 p-3">
            {isEditing && (
                <RemarkStamp
                    ref={remarkRef}
                    remark={remark}
                    positionX={remarkPosition.x}
                    positionY={remarkPosition.y}
                />
            )}
            <Document file={file}>
                <Thumbnail width={508} pageNumber={1} />
            </Document>
            {isEditing && (
                <div
                    style={{
                        width: 'calc(100% - 1.5rem)',
                        backgroundColor: 'rgba(255,0,100,0.9)',
                    }}
                    className="absolute bottom-3 grid h-32 grid-cols-2 gap-2 p-1"
                >
                    <div>
                        <div>rename here:</div>
                        <input
                            type="text"
                            name="filename"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                        />
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
            )}
        </div>
    );
}

export default PreviewPanel;
