let addingText = false;

document.getElementById("addTextBtn").addEventListener("click", () => {
    addingText = true;
    container.classList.add("cursor-texto");
});

container.addEventListener("click", (e) => {
    if (!addingText) return;
    pdfContainer.classList.toggle("cursor-texto", addingText);

    const target = e.target;
    if (!target.classList.contains("pdf-page")) return; // Solo permitir sobre el canvas PDF

    const rect = pdfContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const textBox = document.createElement("div");
    textBox.style.position = "absolute";
    textBox.style.left = x + "px";
    textBox.style.top = y + "px";
    textBox.style.minWidth = "120px";
    textBox.style.minHeight = "30px";
    textBox.style.width = "120px";
    textBox.style.height = "30px";
    textBox.style.border = "none";
    textBox.style.backgroundColor = "rgba(255,255,255,0.8)";
    textBox.style.padding = "4px";
    textBox.style.zIndex = 1000;
    textBox.style.cursor = "move";
    textBox.classList.add("text-box");
    textBox.dataset.originalX = x;
    textBox.dataset.originalY = y;

    const editableArea = document.createElement("div");
    editableArea.contentEditable = true;
    editableArea.textContent = "Ingresar texto";
    editableArea.style.paddingRight = "20px";
    editableArea.style.fontSize = "16px";
    editableArea.style.fontFamily = "Arial, sans-serif";
    editableArea.style.lineHeight = "1.5";
    editableArea.style.width = "100%";
    editableArea.style.boxSizing = "border-box";
    editableArea.style.overflow = "hidden";
    editableArea.style.outline = "none";
    editableArea.style.resize = "none";
    editableArea.style.padding = "0";
    editableArea.style.margin = "0";
    editableArea.style.whiteSpace = "pre-wrap";
    editableArea.style.wordBreak = "break-word";

    editableArea.addEventListener("input", () => {
        autoResize(textBox, editableArea);
    });

    textBox.appendChild(editableArea);

    const directions = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
    directions.forEach(dir => {
        const handle = document.createElement("div");
        handle.className = "resize-handle " + dir;
        textBox.appendChild(handle);

        handle.addEventListener("mousedown", e => {
            e.stopPropagation();
            e.preventDefault();
            startResizing(e, textBox, dir);
        });
    });

    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "✖";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "2px";
    closeBtn.style.right = "4px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.color = "red";
    closeBtn.style.fontSize = "14px";
    closeBtn.style.userSelect = "none";
    closeBtn.setAttribute("contenteditable", "false");

    closeBtn.addEventListener("click", () => {
        textBox.remove();
    });

    textBox.appendChild(closeBtn);

    textBox.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".text-box").forEach(tb => tb.classList.remove("selected"));
        textBox.classList.add("selected");
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".text-box").forEach(tb => tb.classList.remove("selected"));
    });

    pdfContainer.appendChild(textBox); // ✅ Apéndice corregido

    makeDraggable(textBox);

    addingText = false;
    container.classList.remove("cursor-texto");
});

function makeDraggable(el) {
    let isDragging = false;
    let offsetX, offsetY;

    el.addEventListener("mousedown", function(e) {
        isDragging = true;

        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        el.style.userSelect = "none";

    });

    document.addEventListener("mousemove", function(e) {
        if (isDragging) {
            const parent = el.parentElement;
            const bounds = parent.getBoundingClientRect();

            let newLeft = e.clientX - bounds.left - offsetX;
            let newTop = e.clientY - bounds.top - offsetY;

            // Restringir el movimiento dentro del contenedor
            const maxLeft = parent.offsetWidth - el.offsetWidth;
            const maxTop = parent.offsetHeight - el.offsetHeight;

            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
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



function startResizing(e, el, direction) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = el.offsetWidth;
    const startHeight = el.offsetHeight;
    const startLeft = el.offsetLeft;
    const startTop = el.offsetTop;

    const parent = el.parentElement.querySelector(".pdf-page") || el.closest(".pdf-page");
    const bounds = parent.getBoundingClientRect();

    function doResize(e) {
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        if (direction.includes("e")) {
            newWidth = startWidth + dx;
            const maxRight = bounds.left + bounds.width;
            if (el.offsetLeft + newWidth > maxRight) {
                newWidth = maxRight - el.offsetLeft;
            }
        }
        if (direction.includes("s")) {
            newHeight = startHeight + dy;
            const maxBottom = bounds.top + bounds.height;
            if (el.offsetTop + newHeight > maxBottom) {
                newHeight = maxBottom - el.offsetTop;
            }
        }
        if (direction.includes("w")) {
            newWidth = startWidth - dx;
            newLeft = startLeft + dx;
            if (newLeft < bounds.left) {
                newLeft = bounds.left;
                newWidth = startWidth + (startLeft - bounds.left);
            }
        }
        if (direction.includes("n")) {
            newHeight = startHeight - dy;
            newTop = startTop + dy;
            if (newTop < bounds.top) {
                newTop = bounds.top;
                newHeight = startHeight + (startTop - bounds.top);
            }
        }

        if (newWidth > 60) {
            el.style.width = newWidth + "px";
            el.style.left = newLeft + "px";
        }
        if (newHeight > 20) {
            el.style.height = newHeight + "px";
            el.style.top = newTop + "px";
        }
    }

    function stopResize() {
        document.removeEventListener("mousemove", doResize);
        document.removeEventListener("mouseup", stopResize);
    }

    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
}

function autoResize(box, content) {
    content.style.height = "auto";
    const newHeight = content.scrollHeight;
    content.style.height = newHeight + "px";
    box.style.height = newHeight + "px";
}
