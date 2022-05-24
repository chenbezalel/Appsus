import { bookService } from '../apps/books/services/book-service.js'
import { eventBus } from '../services/eventBus-service.js'
import longText from '../apps/books/cmps/long-text.cmp.js'
import reviewAdd from '../apps/books/cmps/review-add.cmp.js'
import reviewPreview from '../apps/books/cmps/review-preview.cmp.js'

export default {
    template: `
        <section v-if="book" class="book-details book-app-main">
            <router-link class="close-details" to="/book">X</router-link>
            <div class="details">
                <div class="main-details">
                    <h1 class="Title">{{book.title}}</h1>
                    <h2 class="authors">{{authors}}</h2>
                    <img :src="book.thumbnail">
                    <h3>Price: <span class="price" :class="color">{{bookPrice}}</span></h3>
                    <h4 class="sale" v-if="book.listPrice.isOnSale">ON SALE!!!</h4>
                </div>
                <div class="more-details">
                    <h1>Subtitle:</h1> 
                    <h2>{{book.subtitle}}</h2>
                    <h1>Description: </h1>
                    <long-text :txt="book.description" />
                    <h1>Page count:</h1> 
                    <h2>{{book.pageCount}}<span> pages</span><span> {{pageCount}}</span></h2>
                    <h1>Published:</h1> 
                    <h2>{{book.publishedDate}}<span> {{publish}}</span></h2>                    
                </div>
            </div>
            <div class="set-page">
                <router-link :to="'/book/'+book.prevBookId">Prev Book</router-link>
                <router-link :to="'/book/'+book.nextBookId">Next Book</router-link>
            </div>

            <hr>
            <review-add @add-review="addReview"></review-add>
            <section v-if="book.reviews && book.reviews.length">
                <h1 class="reviews-title">Reviews:</h1>
                <review-preview  v-for="review in book.reviews" :review="review" @remove="removeReview"/>
            </section>
        </section>
    `,
    components: {
        longText,
        reviewAdd,
        reviewPreview,
    },
    data() {
        return {
            book: null
        };
    },
    created() {
        // const id = this.$route.params.bookId;
        // bookService.get(id)
        //     .then(book => this.book = book);
    },
    methods: {
        addReview(review) {
            bookService.addReview(this.book.id, review)
                .then(book => {
                    this.book = book;
                    eventBus.showSuccessMsg('Book Review was succesfully added')
                })
                .catch(err => {
                    console.error(err);
                    eventBus.showErrorMsg('Error - please try again later')
                });
        },

        removeReview(bookReview) {
            const reviewIdx = this.book.reviews.findIndex(review => review === bookReview)
            bookService.removeReview(this.book.id, reviewIdx)
                .then(book => {
                    this.book = book;
                    eventBus.showSuccessMsg('Book review was succesfully deleted')
                })
                .catch(err => {
                    console.error(err);
                    eventBus.showErrorMsg('Error - please try again later')
                });

        },
        loadBook() {
            bookService.get(this.bookId)
            .then(book => this.book = book);
        }
    },
    computed: {
        bookId() {
            return this.$route.params.bookId
        },

        authors() {
            return this.book.authors.join(', ')
        },

        pageCount() {
            if (+this.book.pageCount > 500) return ' (Long reading)'
            else if (+this.book.pageCount > 200) return ' (Decent Reading)'
            else if (+this.book.pageCount < 100) return ' (Light Reading)'
            else return ''
        },

        publish() {
            const currYear = (new Date).getFullYear();
            if ((currYear - (+this.book.publishedDate)) > 10) return ' (Veteran Book)'
            else if ((currYear - (+this.book.publishedDate)) < 1) return ' (New!)'
            else return ''
        },

        color() {
            const bookPrice = +this.book.listPrice.amount
            if (bookPrice > 150) return 'red'
            else if (bookPrice < 20) return 'green'
            else return ''
        },

        bookPrice() {
            return Intl.NumberFormat(this.book.language, { style: 'currency', currency: this.book.listPrice.currencyCode }).format(this.book.listPrice.amount)
        }

    },
    watch : {
        bookId : {
            handler(){
                this.loadBook()
            },
            immediate : true,
        }
    }
}