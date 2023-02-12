/* eslint-disable prettier/prettier */
import { ClassList } from '../../../base/enums/classList';

function savePlanIcon(color: string, className: ClassList) {
  const icon = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="${className}" viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" > <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /> <polyline points="22 4 12 14.01 9 11.01" /> </svg>`;
  return icon;
}

export default savePlanIcon;
