async function guardarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const paginas = document.querySelectorAll(".pdf-page");

    for (let i = 0; i < paginas.length; i++) {
        const pagina = paginas[i];

        // Crear contenedor temporal para capturar la página real con sus textos
        const contenedorTemp = document.createElement("div");
        contenedorTemp.style.position = "relative";
        contenedorTemp.style.width = pagina.width + "px";
        contenedorTemp.style.height = pagina.height + "px";

        // Usar el canvas ORIGINAL, no clonado
        const canvasOriginal = pagina;
        const canvasRect = canvasOriginal.getBoundingClientRect();

        // Clonar y posicionar el canvas original
        const canvasClone = document.createElement("canvas");
        canvasClone.width = canvasOriginal.width;
        canvasClone.height = canvasOriginal.height;
        const ctx = canvasClone.getContext("2d");
        ctx.drawImage(canvasOriginal, 0, 0);
        contenedorTemp.appendChild(canvasClone);

        // Añadir todos los textos que están sobre esta página
        const textos = Array.from(document.querySelectorAll(".text-box")).filter(box => {
            const parent = box.closest(".pdf-page");
            return parent === pagina;
        });

        textos.forEach(texto => {
            const clon = texto.cloneNode(true);
            clon.contentEditable = false;
            clon.style.position = "absolute";
            // Reposicionar respecto al canvas
            const textRect = texto.getBoundingClientRect();
            clon.style.left = (textRect.left - canvasRect.left) + "px";
            clon.style.top = (textRect.top - canvasRect.top) + "px";
            contenedorTemp.appendChild(clon);
        });

        document.body.appendChild(contenedorTemp);

        // Capturar imagen del contenedor con html2canvas
        const imagenCanvas = await html2canvas(contenedorTemp, {
            scale: 2,
            backgroundColor: "#fff"
        });

        const imgData = imagenCanvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        document.body.removeChild(contenedorTemp);
    }

    pdf.save("pdf_editado.pdf");
}


