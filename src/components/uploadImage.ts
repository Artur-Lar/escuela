import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase"; // Импортируем объект storage из вашего firebase.ts

// Получение ссылки на конечный путь в бакете, где вы хотите сохранить изображение
const imageRef = ref(storage, "images/image.jpg");

// Получение изображения для загрузки (это может быть Blob, File или ArrayBuffer)
const fileInput = document.getElementById(
  "fileInput"
) as HTMLInputElement | null; // Получаем элемент input типа file
if (fileInput && fileInput.files && fileInput.files.length > 0) {
  const file = fileInput.files[0]; // Получаем выбранный файл

  // Загрузка изображения на Storage
  uploadBytes(imageRef, file)
    .then((snapshot) => {
      console.log("Изображение успешно загружено!");
    })
    .catch((error) => {
      console.error("Ошибка при загрузке изображения:", error);
    });
} else {
  console.error("Файл не выбран или не поддерживается браузером.");
}
