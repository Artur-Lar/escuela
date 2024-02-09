// file: src/redux-saga/imageActions.ts

export const UPLOAD_IMAGE_REQUEST = "UPLOAD_IMAGE_REQUEST";
export const UPLOAD_IMAGE_SUCCESS = "UPLOAD_IMAGE_SUCCESS";
export const UPLOAD_IMAGE_FAILURE = "UPLOAD_IMAGE_FAILURE";

export interface UploadImageRequestAction {
  type: typeof UPLOAD_IMAGE_REQUEST;
  file: File;
}

export interface UploadImageSuccessAction {
  type: typeof UPLOAD_IMAGE_SUCCESS;
  imageUrl: string;
}

export interface UploadImageFailureAction {
  type: typeof UPLOAD_IMAGE_FAILURE;
  error: string;
}

export const uploadImageRequest = (file: File): UploadImageRequestAction => ({
  type: UPLOAD_IMAGE_REQUEST,
  file,
});

export type ImageActionTypes =
  | UploadImageRequestAction
  | UploadImageSuccessAction
  | UploadImageFailureAction;
