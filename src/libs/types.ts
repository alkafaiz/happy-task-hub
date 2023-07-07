export interface Modification {
    filename: string;
    remark: { text: string; x: number; y: number };
    remarkSize: { width: number; height: number };
}
