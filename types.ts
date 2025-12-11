export interface Photo {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  photos: Photo[];
  photographerEmail: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  generatedSlug: string | null;
}

export const AUTHORIZED_EMAIL = "zanjo3717@gmail.com";