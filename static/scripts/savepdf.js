async function guardarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const paginas = document.querySelectorAll(".pdf-page");

    for (let i = 0; i < paginas.length; i++) {
        const pagina = paginas[i];

        // Crear un contenedor temporal que incluya la página y sus textos agregados
        const contenedorTemp = document.createElement("div");
        contenedorTemp.style.position = "relative";
        contenedorTemp.style.width = pagina.offsetWidth + "px";
        contenedorTemp.style.height = pagina.offsetHeight + "px";

        // Clonar el canvas de la página
        const canvasClonado = pagina.cloneNode(true);
        contenedorTemp.appendChild(canvasClonado);

        // Agregar los elementos de texto posicionados sobre esta página
        const textos = Array.from(document.querySelectorAll(".text-box")).filter(box => {
            const parent = box.closest(".pdf-page");
            return parent === pagina;
        });

        textos.forEach(texto => {
            const clon = texto.cloneNode(true);
            clon.contentEditable = false;
            contenedorTemp.appendChild(clon);
        });

        document.body.appendChild(contenedorTemp);

        // Capturar imagen del contenido combinado
        const canvas = await html2canvas(contenedorTemp, {
            scale: 2,
            backgroundColor: "#fff"
        });

        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        document.body.removeChild(contenedorTemp);
    }

    pdf.save("pdf_editado.pdf");
}

