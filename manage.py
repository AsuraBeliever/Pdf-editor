from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import os
import uuid
import shutil

app = FastAPI()

PDF_DIR = "pdfs"
os.makedirs(PDF_DIR, exist_ok=True)


@app.post("/cargar_pdf/")
async def cargar_pdf(file: UploadFile = File(...)):
    # Guarda el archivo en el sistema de archivos
    file_ext = os.path.splitext(file.filename)[1]
    if file_ext.lower() != ".pdf":
        raise HTTPException(status_code=400, detail="Solo se permiten archivos PDF")

    file_id = f"{uuid.uuid4()}.pdf"
    file_path = os.path.join(PDF_DIR, file_id)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "Archivo PDF cargado exitosamente", "file_id": file_id}


@app.get("/descargar_pdf/{file_id}")
def descargar_pdf(file_id: str):
    file_path = os.path.join(PDF_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return FileResponse(path=file_path, filename=file_id, media_type='application/pdf')


@app.post("/dibujar_en_pdf/")
def dibujar_en_pdf(file_id: str, texto: str = "Hola desde FastAPI", pagina: int = 0):
    file_path = os.path.join(PDF_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    # Abre el PDF y dibuja texto en la página seleccionada
    doc = fitz.open(file_path)
    if pagina >= len(doc):
        raise HTTPException(status_code=400, detail="Número de página inválido")

    page = doc[pagina]
    page.insert_text((72, 72), texto, fontsize=14, color=(1, 0, 0))  # (x, y), rojo

    new_file_id = f"{uuid.uuid4()}.pdf"
    new_file_path = os.path.join(PDF_DIR, new_file_id)
    doc.save(new_file_path)
    doc.close()

    return {"message": "Texto agregado exitosamente", "file_id": new_file_id}
