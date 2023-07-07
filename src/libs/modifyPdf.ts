import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function addRemarkToDocument(
    document: string | ArrayBuffer | Uint8Array,
    remark: string,
    {
        x,
        y,
        remarkWidth,
        remarkHight,
        paddingX = 8,
        paddingY = 4,
    }: {
        x: number;
        y: number;
        remarkWidth: number;
        remarkHight: number;
        paddingX?: number;
        paddingY?: number;
    }
) {
    // This should be a Uint8Array or ArrayBuffer
    // This data can be obtained in a number of different ways
    // If your running in a Node environment, you could use fs.readFile()
    // In the browser, you could make a fetch() call and use res.arrayBuffer()

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(document);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.moveTo(0, 0);

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();

    // Draw rectangle border around remark
    const borderWidth = 4;

    const rectanglePosition = {
        x: (x / 100) * width - paddingX,
        y: height - 20 - (y / 100) * height - remarkHight / 2 + paddingY * 2 + borderWidth,
    };

    firstPage.drawRectangle({
        ...rectanglePosition,
        width: remarkWidth,
        height: remarkHight - borderWidth * 2,
        borderWidth,
        borderColor: rgb(0.95, 0.1, 0.1),
    });



    // Draw the text remark
    const manualAdjustment = 2;
    const textPosition = {
        y: rectanglePosition.y + paddingY + borderWidth + manualAdjustment,
        x: rectanglePosition.x + borderWidth + paddingX,
    };

    firstPage.drawText(remark, {
        ...textPosition,
        size: 20,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;

    // For example, `pdfBytes` can be:
    //   • Written to a file in Node
    //   • Downloaded from the browser
    //   • Rendered in an <iframe>
}
