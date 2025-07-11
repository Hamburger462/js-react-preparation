window.addEventListener("load", () => {
    const Gallery = document.getElementById("Gallery");
    let images = [
        {src: "img/cherry.jpg", alt: "Cherry", title: "Cherries"},
        {src: "img/lemon.jpg", alt: "Lemon", title: "Lemon"},
        {src: "img/mango.jpg", alt: "Those who know", title: "Mango"},
        {src: "img/orange.jpg", alt: "Orange", title: "Orange"},
        {src: "img/raspberry.jpg", alt: "Raspberry", title: "Raspberry"}
    ];
    for(let elem of images){
        let img = document.createElement("img");
        img.src = elem.src;
        img.alt = elem.alt;
        Gallery.appendChild(img);
    }
})