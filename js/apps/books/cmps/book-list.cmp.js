import bookPreview from './book-preview.cmp.js'

export default {
  props: ['books'],
  template: `
        <section class="book-list">
            <ul>
                <li v-for="book in books" class="book-preview-container" :key="book.id">
                    <book-preview :book='book' />
                    <router-link :to="/book/+book.id" class="details-btn">Details</router-link>
                </li>
            </ul>
        </section>
    `,
  components: {
    bookPreview,
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
  computed: {},
}
