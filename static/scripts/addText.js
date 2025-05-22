let addingText = false;

    document.getElementById("addTextBtn").addEventListener("click", () => {
        addingText = true;
        container.classList.add("cursor-texto");
    });

    container.addEventListener("click", (e) => {
        if (!addingText) return;
        pdfContainer.classList.toggle("cursor-texto", addingText)

        const target = e.target;
        if (!target.classList.contains("pdf-page")) return; // Solo permitir sobre el canvas PDF

        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;


        const textBox = document.createElement("div");
        textBox.addEventListener("dblclick", () => {
            textBox.remove()
        });
        textBox.contentEditable = true;
        textBox.textContent = "Ingresar texto aqui";
        textBox.style.position = "absolute";
        textBox.style.left = x + "px";
        textBox.style.top = y + "px";
        textBox.style.minWidth = "100px";
        textBox.style.minHeight = "30px";
        textBox.style.border = "1px dashed #000";
        textBox.style.backgroundColor = "rgba(255,255,255,0.8)";
        textBox.style.padding = "4px";
        textBox.style.resize = "both";
        textBox.style.overflow = "auto";
        textBox.style.zIndex = 1000;
        textBox.style.cursor = "move";

        makeDraggable(textBox);
        target.parentElement.appendChild(textBox);
        textBox.style.left = rect.left + x + "px";
        textBox.style.top = rect.top + y + "px";

        addingText = false;
        container.classList.remove("cursor-texto");
    });

    function makeDraggable(el) {
        let isDragging = false;
        let offsetX, offsetY;

        el.addEventListener("mousedown", function(e) {
            isDragging = true;
            offsetX = e.clientX - el.getBoundingClientRect().left;
            offsetY = e.clientY - el.getBoundingClientRect().top;
            el.style.userSelect = "none";
        });

        document.addEventListener("mousemove", function(e) {
            if (isDragging) {
                el.style.left = (e.clientX - offsetX) + "px";
                el.style.top = (e.clientY - offsetY) + "px";
            }
        });

        document.addEventListener("mouseup", function() {
            isDragging = false;
            el.style.userSelect = "auto";
        });
    }