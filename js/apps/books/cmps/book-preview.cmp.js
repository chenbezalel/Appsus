export default {
    props:['book'],
    template:`
        <section class="book-preview">
            <p>{{book.title}}</p>
            <img :src="book.thumbnail">
            <p>{{bookPrice}}</p>
        </section>
    `,
    data(){
        return{}
    },
    created(){

    },
    methods:{

    },
    computed:{
        bookPrice(){
            return Intl.NumberFormat(this.book.language, { style: 'currency', currency: this.book.listPrice.currencyCode}).format(this.book.listPrice.amount)
        } 
    }
}