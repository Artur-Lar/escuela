import { put, takeLatest, call } from "redux-saga/effects";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UPLOAD_IMAGE_REQUEST = "UPLOAD_IMAGE_REQUEST";
const UPLOAD_IMAGE_SUCCESS = "UPLOAD_IMAGE_SUCCESS";
const UPLOAD_IMAGE_FAILURE = "UPLOAD_IMAGE_FAILURE";

export const uploadImageRequest = (file: File) => ({
  type: UPLOAD_IMAGE_REQUEST as typeof UPLOAD_IMAGE_REQUEST,
  payload: file,
});

const uploadImageSuccess = (downloadURL: string) => ({
  type: UPLOAD_IMAGE_SUCCESS as typeof UPLOAD_IMAGE_SUCCESS,
  payload: downloadURL,
});

const uploadImageFailure = (error: Error) => ({
  type: UPLOAD_IMAGE_FAILURE as typeof UPLOAD_IMAGE_FAILURE,
  payload: error,
});

function* uploadImage(action: ReturnType<typeof uploadImageRequest>) {
  try {
    const file: File = action.payload;
    const storage = getStorage();
    const storageRef = ref(storage);
    const imageRef = ref(storageRef, `images/${file.name}`);
    yield call(uploadBytes, imageRef, file);
    const downloadURL: string = yield call(getDownloadURL, imageRef);
    yield put(uploadImageSuccess(downloadURL));
  } catch (error) {
    yield put(uploadImageFailure(error as Error));
  }
}

export function* imageSaga() {
  yield takeLatest(UPLOAD_IMAGE_REQUEST, uploadImage);
}
