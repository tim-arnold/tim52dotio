import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs';
import path from 'path';

export async function getBase64(imagePath: string): Promise<string> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    const file = fs.readFileSync(fullPath);
    const { base64 } = await getPlaiceholder(file);
    return base64;
  } catch (err) {
    console.warn(`Failed to generate placeholder for ${imagePath}:`, err);
    // Return a generic base64 placeholder as fallback
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  }
}

export interface ImageWithBlur {
  src: string;
  blurDataURL: string;
  width?: number;
  height?: number;
}