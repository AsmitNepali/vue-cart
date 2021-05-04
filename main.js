var app = new Vue({
    el: "#app",
    data: {
        brand: "Adidas",
        product: "Football",
        productName: "2014",
        productInfo: "The 2014 FIFA World Cup was the 20th FIFA World Cup, the quadrennial world championship for men's national football teams organised by FIFA. It took place in Brazil from 12 June to 13 July 2014, after the country was awarded the hosting rights in. ",
        image:"./images/2014.jpg",
        inStock:false,
        inventory: 5,
        details: ["Air ball", "18% off", "Adidas Brand"],
        variants: [
        {
            variantId: 225,
            variantYear: "2018",
            color: "green",
            variantImage: "./images/2018.jpg",
        },
        {
            variantId: 226,
            variantYear: "2014",
            color:"red",
            variantImage: "./images/2014.jpg",
        },
        ],
        cart:0,
    },
    methods:{
        addToCart: function(){
            if(this.inventory >0)
            {
                this.cart++;
                this.inventory--;
            }
            else
                alert("out of stock");

        },
        updateProduct(img, year){
            this.image = img;
            this.productName = year;
        }
    }
});
