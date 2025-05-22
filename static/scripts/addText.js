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
        textBox.style.position = "absolute";
        textBox.style.left = x + "px";
        textBox.style.top = y + "px";
        textBox.style.minWidth = "120px";
        textBox.style.minHeight = "30px";
        textBox.style.border = "1px dashed #000";
        textBox.style.backgroundColor = "rgba(255,255,255,0.8)";
        textBox.style.padding = "4px";
        textBox.style.resize = "both";
        textBox.style.overflow = "auto";
        textBox.style.zIndex = 1000;
        textBox.style.cursor = "move";

        const editableArea = document.createElement("div");
        editableArea.contentEditable = true;
        editableArea.textContent = "Ingresar texto";
        editableArea.style.minHeight = "20px";

        textBox.appendChild(editableArea);

        // Botón de cerrar fuera del área editable
        const closeBtn = document.createElement("span");
        closeBtn.innerHTML = "✖";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "2px";
        closeBtn.style.right = "4px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.color = "red";
        closeBtn.style.fontSize = "14px";
        closeBtn.style.userSelect = "none";
        closeBtn.setAttribute("contenteditable", "false")
        closeBtn.style.userSelect = "none";

        closeBtn.addEventListener("click", () => {
            textBox.remove();
        });

        textBox.appendChild(closeBtn);

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
                const parent = el.parentElement.querySelector(".pdf-page");
                const bounds = parent.getBoundingClientRect();

                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                // Limitar dentro del canvas
                const maxLeft = bounds.right - el.offsetWidth;
                const maxTop = bounds.bottom - el.offsetHeight;

                if (newLeft < bounds.left) newLeft = bounds.left;
                if (newTop < bounds.top) newTop = bounds.top;
                if (newLeft > maxLeft) newLeft = maxLeft;
                if (newTop > maxTop) newTop = maxTop;

                el.style.left = newLeft + "px";
                el.style.top = newTop + "px";
            }
        });


        document.addEventListener("mouseup", function() {
            isDragging = false;
            el.style.userSelect = "auto";
        });
    }