// get today date in format DD.MM.YYYY
const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

const DEFAULT_VALUES = {
    remark: today,
    remarkPosition: { x: 50, y: 5 },
    remarkSize: { width: 0, height: 0 },
};

const MAX_FILES_COUNT = 10;

export { DEFAULT_VALUES, MAX_FILES_COUNT };
