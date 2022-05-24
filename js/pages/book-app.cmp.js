import { bookService } from '../apps/books/services/book-service.js';
import bookFilter from '../apps/books/cmps/book-filter.cmp.js';
import bookList from '../apps/books/cmps/book-list.cmp.js';
import bookAdd from '../apps/books/cmps/book-add.cmp.js';

export default {
    template: `
        <section class="book-app book-app-main">
            <book-filter @filtered="setFilter" />
            <book-add @bookAdded="addBook" />
            <book-list :books="booksForDisplay"/>
        </section>
    `,
    components: {
        bookFilter,
        bookList,
        bookAdd
    },
    data() {
        return {
            books: null,
            filterBy: null,
            selectedBook: null
        };
    },
    created() {
        bookService.query()
            .then(books => this.books = books);
    },
    methods: {
        setFilter(filterBy){
            this.filterBy = filterBy;
        },
        addBook(book){
            this.books.push(book);
        },  
        
    },
    computed: {
        
        booksForDisplay(){
            if (!this.filterBy) return this.books;
            const regex = new RegExp(this.filterBy.name, 'i');
            const min = this.filterBy.fromPrice || 0;
            const max = this.filterBy.toPrice || Infinity;
            return this.books.filter(book => regex.test(book.title))
            .filter(book => book.listPrice.amount > min)
            .filter(book => book.listPrice.amount < max)
            
        }
    },
};
