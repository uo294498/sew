class Fondo {
    constructor(pais,capital,circuito) {
        this.pais=pais;
        this.capital=capital;
        this.circuito=circuito;

        this.consulta();
    }

    consulta() {
        const flickrAPI = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=39331cb0e0c89b8cc1710a11f3e68ec0&tags=${this.circuito}&format=json&nojsoncallback=1`;

        $.getJSON(flickrAPI)
            .done((data) => {
                if (data.photos.photo.length > 0) {
                    // Pos: 3 6 11 12
                    const firstPhoto = data.photos.photo[1];
                    const imageUrl = `https://farm${firstPhoto.farm}.staticflickr.com/${firstPhoto.server}/${firstPhoto.id}_${firstPhoto.secret}.jpg`;
                    //const imageUrl = `https://farm${firstPhoto.farm}.staticflickr.com/${firstPhoto.server}/${firstPhoto.id}_b.jpg`;


                    $("body").css("background-image", `url(${imageUrl})`);
                    $("body").css("background-size", "cover");
                }
            });
    }

}