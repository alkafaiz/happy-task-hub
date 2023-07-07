import React, { forwardRef } from 'react';

const RemarkStamp = forwardRef<
    HTMLDivElement,
    {
        remark: string;
        positionX: number;
        positionY: number;
    }
>(({ remark, positionX, positionY }, ref) => {
    return (
        <div
            ref={ref}
            id="remark"
            className="absolute z-10 border-4 px-2 py-1 text-xl font-bold"
            style={{
                left: `${positionX}%`,
                top: `${positionY}%`,
                color: 'rgba(255,0,100,0.9)',
                borderColor: 'rgba(255,0,100,0.9)',
            }}
        >
            {remark}
        </div>
    );
});

export default RemarkStamp;
