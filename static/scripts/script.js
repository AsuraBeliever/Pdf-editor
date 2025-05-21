const canvas = document.getElementById("pdfCanvas");
    const ctx = canvas.getContext("2d");
    const pdfURL = sessionStorage.getItem("pdfToEdit");
    
    console.log("pdfURL:", pdfURL)
    if (!pdfURL) {
        alert("No se encontró ningún archivo PDF. Regresa al menú para cargar uno.");
        window.location.href = "index.html";
    } else {
        pdfjsLib.getDocument(pdfURL).promise.then(pdf => {
            console.log("PDF cargado. Total de páginas: " + pdf.numPages);
            // Carga la primera página
            return pdf.getPage(1);
        }).then(page => {
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            // Ajusta el tamaño del canvas
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            return page.render(renderContext).promise;
        }).catch(error => {
            console.error("Error al renderizar el PDF:", error);
            alert("Ocurrió un error al mostrar el PDF.");
        });
    }