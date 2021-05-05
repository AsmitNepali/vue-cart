var eventBus = new Vue();
Vue.component('product',{
    props:{
        premium:{
            type:Boolean,
            required:false,
        }
    },
    template:`<div>
            <nav class="navbar navbar-expand-lg navbar-light bg-primary">
     <div class="container-fluid">
       <a class="navbar-brand text-white" href="#">Vue JS</a>
       <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
         <span class="navbar-toggler-icon"></span>
       </button>
       <div class="collapse navbar-collapse" id="navbarNav">
         <ul class="navbar-nav">
           <li class="nav-item">
             <a class="nav-link active" aria-current="page" href="#">Home</a>
           </li>
           <li class="nav-item">
             <a class="nav-link" href="#">Features</a>
           </li>
           <li class="nav-item">
             <a class="nav-link" href="#">Pricing</a>
           </li>
           <li class="nav-item">
             <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
           </li>
         </ul>
       </div>
     </div>
   </nav>
   <section class="mt-5">
       <div class="container-sm">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card" style="width: 18rem;">
                          <img :src="image" class="card-img-top" alt="...">
                          <div class="card-body">
                            <h5 class="card-title">{{ brand }} {{ productName }}</h5>
                           <span v-if="inventory > 10" class="badge bg-success mb-3">In Stock</span>

                            <span v-else-if="inventory < 10 && inventory > 0" class="badge bg-primary mb-3">Almost Sold !</span>

                            <span v-else class="badge bg-danger mb-3">Out Of Stock</span>

                            <div>
                                <a href="javascript:void(0)" @click="addToCart()" class="btn btn-primary" :disabled="!inStock">Add To Cart</a>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="info">
                            <h2>{{ title}}</h2>
                            <div class="">
                                <ul>
                                    <li v-for="detail in details">{{ detail }}</li>
                                </ul>
                                <div>Shipping: {{ shipping }}</div>
                                <div v-for="(variant, index) in variants"
                                    :key="variant.variantId"
                                    class="badge"
                                    :style="{backgroundColor: variant.color}">
                                    <p @mouseover="updateProduct(index, variant.variantYear)">{{ variant.variantYear}}</p>
                                </div>
                            </div>
                            <div class="text-justify">{{ productInfo }}</div>

                        </div>
                    </div>
               </div>
           </div>
       </div>
   </section>
   <product-tabs :reviews="reviews"></product-tabs>

    </div>`,
   data() {
        return  {
            brand: "Adidas",
            product: "Football",
            productName: "2014",
            productInfo: "The 2014 FIFA World Cup was the 20th FIFA World Cup, the quadrennial world championship for men's national football teams organised by FIFA. It took place in Brazil from 12 June to 13 July 2014, after the country was awarded the hosting rights in. ",
            selectedVariant: 0,
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
            reviews:[],
            errors:[],
        }
    },
    methods:{
        addToCart: function(){
            this.$emit('add-to-cart',this.variants[this.selectedVariant].variantId);
            if(this.inventory >0)
            {

                this.inventory--;
            }
            else
                alert("out of stock");

        },
        updateProduct(index, year){
           this.selectedVariant = index;
           console.log(index);
            this.productName = year;
        },
    },

    mounted(){
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        })
    },

    computed: {
        title(){
            return this.brand +' '+this.productName;
        },
        image(){
            return this.variants[this.selectedVariant].variantImage;
        },
        shipping(){
            if(this.premium){
                return "2.99";
            }
            return "Free";
        }
    }
});

Vue.component('product-review',{
    template:`
    <div>

    <div class="container">
    <h3 v-if="errors.length">Please correct this error(s).</h3>
    <ul>
        <li v-for="error in errors">{{error}}</li>
    </ul>
    <form @submit.prevent="onSubmit">
    <div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Name</label>
  <input v-model="name" type="name" class="form-control" id="exampleFormControlInput1" placeholder="John Doe">
</div>
<div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Review</label>
  <textarea v-model="review" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>
<div class="col-auto">
    <button type="submit" class="btn btn-primary mb-3">Submit</button>
  </div>
</form>
</div>
</div>`,
    data() {
        return {
                name:null,
                review:null,
                 errors: []
            }
        },
    methods:{
        onSubmit(){
            if(this.name && this.review)
            {
                let productReview = {
                name: this.name,
                review: this.review,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null

            }
            else
            {
                if(!this.name) this.errors.push("Name field is required.")
                if(!this.review) this.errors.push("Review field is required.")
            }

        }
    }
    });

Vue.component('product-tabs',{
    props:{
        reviews:{
            type:Array,
            required:true,
        }
    },
    template:`
        <div>
            <span v-for="(tab,index) in tabs" :key="index"
            :class="{active: selectedTab ===tab}"
            @click="selectedTab = tab"
            >
            {{tab}}
            </span>
            <div v-show="selectedTab === 'Review'">
             <h1>Review List</h1>
            <p v-if="!reviews.length">NO Review Yet !</p>
            <ul v-else>
            <li v-for="review in reviews">
            <p>Name: {{review.name}}</p>
            <p>Description: {{review.review}}</p>
            </li>
            </ul>
            </div>
            <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>
    `,
    data(){
        return{
            tabs:['Review','Make a Review'],
            selectedTab:'Review',
        }
    }
});

var app = new Vue({
    el: "#app",
    data:{
        premium:true,
        cart:[],
    },
    methods:{
        updateCart(id){
            this.cart.push(id);
        }
    }

});
