const iconMap = {
        pdf: "./../icons/file.svg",
        doc: "./../icons/file-text.svg",
        docx: "./../icons/file-text.svg",
        default: "./../icons/file.svg",
    };

    const pathname = window.location.pathname;

    console.log("./references/" + pathname.split("/").pop().replace(/\.[^/.]+$/, "") + ".json");

    fetch("/references/" + pathname.split("/").pop().replace(/\.[^/.]+$/, "") + ".json")
        .then((r) => r.json())
        .then((data) => {
            const list = document.getElementById("list");
            list.innerHTML = "";

            data.forEach((group) => {
                // Create and insert the header
                const headerEl = document.createElement("h2");
                headerEl.textContent = group.header;
                list.appendChild(headerEl);

                // Create a container <ul> for the entries under this header
                const ul = document.createElement("ul");
                
                group.entries.forEach((item) => {
                    const ext = item.file.split(".").pop().toLowerCase();
                    const icon = iconMap[ext] || iconMap.default;
                    var reference; item.file.startsWith("https://drive.google.com") ? item.file : "./../pdfs/"+item.file
                    if (item.file.startsWith("https://drive.google.com")){
reference = item.file;
                    }else if (ext == "pdf"){
reference = "./../pdfs/"+item.file;
                    }else{
                        reference = "./../docs/" + item.file;
                    }
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <div class="file-meta">
                            <img src="${icon}" alt="${ext} icon" class="file-icon" />
                            <div>
                                <strong>${item.title}</strong>
                                <div class="desc">${item.desc == undefined ? "" : item.desc}</div>
                            </div>
                        </div>
                        <div class="file-actions">
                            <a class="download" href="${reference}" download><img src="./../icons/download.svg" alt="download" class="download-icon" /></a>
                            <button onclick="viewPDF('${reference}', '${item.title}')"><img src="./../icons/view.svg" alt="view" class="download-icon" /></button>
                        </div>
                    `;
                    ul.appendChild(li);
                });

                list.appendChild(ul);
            });
        });

    function viewPDF(url, title) {/*
        document.getElementById("pdfFrame").src = url;
        document.getElementById("viewer-title").textContent = title;
        document.getElementById("viewer").style.display = "block";
        document.getElementById("viewer").scrollIntoView({ behavior: "smooth" });
*/
        
    //const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(window.location.origin + '/' + url)}`;
    const ext = url.split(".").pop().toLowerCase();
    let viewerUrl = url;

    if (ext === "docx" || ext === "doc") {
        viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(window.location.origin + '/' + url)}`;
    }
    
    document.getElementById("pdfFrame").src = viewerUrl;
    document.getElementById("viewer-title").textContent = title;
    document.getElementById("viewer").style.display = "block";
    document.getElementById("viewer").scrollIntoView({ behavior: "smooth" });

    }

    function closeViewer() {
        document.getElementById("pdfFrame").src = "";
        document.getElementById("viewer").style.display = "none";
    }