function descargarPDF() {
  // 1. Crear un Blob con contenido de ejemplo (reemplázalo con tu PDF real)
  const contenido = '%PDF-1.4 ...'; // Aquí irían los bytes de un PDF real
  const blob = new Blob([contenido], { type: 'application/pdf' });

  // 2. Generar URL temporal
  const url = URL.createObjectURL(blob);

  // 3. Crear enlace y simular clic
  const a = document.createElement('a');
  a.href = url;
  a.download = 'documento_editado.pdf'; // Nombre del archivo
  document.body.appendChild(a);
  a.click();

  // 4. Limpiar
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
