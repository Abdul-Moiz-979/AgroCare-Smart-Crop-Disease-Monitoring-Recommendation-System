import cv2
import numpy as np
from tensorflow.keras.applications.efficientnet import preprocess_input


def smart_center_crop(img: np.ndarray, target_size: int) -> np.ndarray:
    """Resize proportionally and center-crop to a square."""
    h, w = img.shape[:2]
    if h < w:
        new_h, new_w = target_size, int(w * (target_size / h))
    else:
        new_w, new_h = target_size, int(h * (target_size / w))

    resized_img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
    y_center, x_center = new_h // 2, new_w // 2
    half = target_size // 2

    return resized_img[
        y_center - half : y_center + half,
        x_center - half : x_center + half,
    ]


def preprocess_image_bytes(image_bytes: bytes, target_size: int) -> tuple[np.ndarray, np.ndarray]:
    """
    Decode raw image bytes, center-crop, and create tensors for both
    validator and disease models.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image file.")

    cropped_img = smart_center_crop(img, target_size)
    img_rgb = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2RGB)

    img_array = np.expand_dims(img_rgb, axis=0).astype("float32")
    disease_tensor = preprocess_input(img_array.copy())

    return img_array, disease_tensor
