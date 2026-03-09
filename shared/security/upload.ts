export function assertMaxFileSize(file: File, maxBytes: number) {
  if (file.size > maxBytes) {
    throw new Error(`File exceeds ${Math.floor(maxBytes / (1024 * 1024))}MB limit`);
  }
}

export function sanitizeFilename(filename: string) {
  return filename
    .split(/[\\/]/)
    .pop()
    ?.replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9._-]/g, '-') ?? 'upload.bin';
}

export function assertImageFile(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
}

export function assertSafeSlug(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Invalid slug');
  }
}
