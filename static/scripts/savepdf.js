async function savepdf() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const paginas = document.querySelectorAll(".pdf-page");
    const textos = document.querySelectorAll(".text-box");

    for (let i = 0; i < paginas.length; i++) {
        const pagina = paginas[i];
        const paginaRect = pagina.getBoundingClientRect();

        // Clonar las cajas de texto relevantes y agregarlas temporalmente a la página
        const clones = [];
        textos.forEach(texto => {
            const textoRect = texto.getBoundingClientRect();

            if (textoRect.left >= paginaRect.left &&
                textoRect.top >= paginaRect.top &&
                textoRect.right <= paginaRect.right &&
                textoRect.bottom <= paginaRect.bottom) {

                const clon = texto.cloneNode(true);

                // Eliminar elementos de UI
                clon.querySelectorAll(".resize-handle, span").forEach(el => el.remove());

                clon.contentEditable = false;
                clon.style.position = "absolute";
                clon.style.left = (textoRect.left - paginaRect.left) + "px";
                clon.style.top = (textoRect.top - paginaRect.top) + "px";
                clon.style.width = texto.offsetWidth + "px";
                clon.style.height = texto.offsetHeight + "px";
                clon.style.border = "none";
                clon.style.backgroundColor = "transparent";
                clon.style.zIndex = "1000";

                pagina.appendChild(clon);
                clones.push(clon);
            }
        });

        // Capturar la página renderizada por PDF.js + textos añadidos
        const imagenCanvas = await html2canvas(pagina, {
            scale: 2,
            backgroundColor: "#ffffff", // blanco para PDF
            useCORS: true,
            allowTaint: true
        });

        // Eliminar los clones de texto después de capturar
        clones.forEach(clon => clon.remove());

        const imgData = imagenCanvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save("pdf_editado.pdf");
}
