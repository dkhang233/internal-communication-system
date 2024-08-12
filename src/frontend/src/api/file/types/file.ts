export interface ImageUploadResponse {
  originUrl: string // Url dẫn tới ảnh gốc
  thumbnailUrl: string
}

export type ImageUploadResponseData = ApiResponseData<ImageUploadResponse>
export type FileUploadResponseData = ApiResponseData<string>
