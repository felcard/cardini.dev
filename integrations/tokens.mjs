// Placeholders rendered into the page and swapped for measured values after the build.
/** @param {'HTML'|'CSS'|'JS'|'FONT'|'ICON'|'IMG'|'IMGN'|'SUB'|'SAVED'|'TOTAL'|'CO2'} key */
export const token = (key) => `__RC_${key}__`;
