import { request } from "@/utils/service"
import { FileUploadResponseData, ImageUploadResponseData } from "./types/file"
import { UploadRawFile } from "element-plus"
import { useChatStore } from "@/store/modules/chat"

export const uploadFileApi = (file: UploadRawFile) => {
  return request<FileUploadResponseData>({
    url: "/files/upload",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: { file: file }
  })
}

export const uploadImageApi = (image: UploadRawFile, localUrl: string) => {
  return request<ImageUploadResponseData>({
    url: "/files/upload/image",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: { image: image },
    onUploadProgress: function (progressEvent) {
      if (progressEvent.total) {
        useChatStore().updateUploadProgress(localUrl, Math.round((progressEvent.loaded * 100) / progressEvent?.total))
      }
    }
  })
}

export const downloadApi = (filePath: string) => {
  return request<ArrayBuffer>({
    url: "filePath",
    method: "get",
    responseType: "blob"
  })
}
