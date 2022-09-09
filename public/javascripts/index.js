
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    try{
        let response = await fetch("api/v1/urls/preview?url=" + url);
        let preview = await response.text();
        console.log(preview);
        displayPreviews(preview);
    } catch(error) {
        displayPreviews("There is an Error:" + error);
    }
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
