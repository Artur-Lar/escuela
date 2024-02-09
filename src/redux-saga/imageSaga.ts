import { put, takeLatest, call } from "redux-saga/effects";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Action types
const UPLOAD_IMAGE_REQUEST = "UPLOAD_IMAGE_REQUEST";
const UPLOAD_IMAGE_SUCCESS = "UPLOAD_IMAGE_SUCCESS";
const UPLOAD_IMAGE_FAILURE = "UPLOAD_IMAGE_FAILURE";

// Action creators
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

// Saga worker function
function* uploadImage(action: ReturnType<typeof uploadImageRequest>) {
  try {
    const file: File = action.payload;
    const storage = getStorage(); // Получаем ссылку на хранилище Firebase
    const storageRef = ref(storage); // Создаем ссылку на корень хранилища
    const imageRef = ref(storageRef, `images/${file.name}`); // Создаем ссылку на конкретный путь
    yield call(uploadBytes, imageRef, file); // Загружаем файл
    const downloadURL: string = yield call(getDownloadURL, imageRef); // Получаем URL загруженного изображения
    yield put(uploadImageSuccess(downloadURL)); // Отправляем успешное действие
  } catch (error) {
    yield put(uploadImageFailure(error as Error)); // Отправляем действие об ошибке
  }
}

// Saga watcher function
export function* imageSaga() {
  yield takeLatest(UPLOAD_IMAGE_REQUEST, uploadImage);
}
