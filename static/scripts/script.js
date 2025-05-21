const input = document.getElementById("fileInput");
        const container = document.getElementById("pdfContainer");

        input.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                const fileURL = URL.createObjectURL(file);

                container.innerHTML = ""; // limpia el contenedor antes de mostrar uno nuevo

                pdfjsLib.getDocument(fileURL).promise.then(pdf => {
                    console.log("Total de páginas: " + pdf.numPages);

                    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                        pdf.getPage(pageNumber).then(page => {
                            const scale = 1.5;
                            const viewport = page.getViewport({ scale });

                            const canvas = document.createElement("canvas");
                            canvas.className = "pdf-page";
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;

                            const context = canvas.getContext("2d");
                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport
                            };

                            page.render(renderContext);
                            container.appendChild(canvas);
                        });
                    }
                }).catch(error => {
                    console.error("Error al mostrar el PDF:", error);
                    alert("Error al mostrar el PDF.");
                });
            } else {
                alert("Por favor selecciona un archivo PDF válido.");
            }
        });