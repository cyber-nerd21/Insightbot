import fitz  # pymupdf
import pytesseract
from PIL import Image
import io

MIN_TEXT_LENGTH = 50  # if page has less than this, treat as image-based

def parse_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    full_text = ""

    for page in doc:
        page_text = page.get_text().strip()

        if len(page_text) >= MIN_TEXT_LENGTH:
            # Normal text-based page
            full_text += page_text + "\n"
        else:
            # Image-based page  render to image then OCR
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            image = Image.open(io.BytesIO(img_bytes))
            ocr_text = pytesseract.image_to_string(image)
            full_text += ocr_text + "\n"

    return full_text  