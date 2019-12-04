<template>
    <v-container>
        <v-layout row wrap>            
                <Select class="ma-3" :selectItems="['Bruchsal', 'Karlsruhe']" name="city" @getSelectedField="getSelectedField"/>
                <Select class="ma-3" :selectItems="['activity', 'Bib']" name="category" @getSelectedField="getSelectedField"/>
                <Select class="ma-3" :selectItems="['Kinderpass', 'Karlsruhe-pass']" name="pass" @getSelectedField="getSelectedField" />
                <v-btn @click="searchForPosts()" dark> SEARCH </v-btn>
        </v-layout>



    </v-container>
</template>

<script>
import axios from 'axios'
import Select from './Select'
import Post from './Post.vue'

export default {
    data(){
        return {
            currentPage: 1,
            postsLoaded: false,
            pageCount: 0,
            visibleItemsPerPageCount: 10,
            postPage : 1,
            posts: [],
            categories: [],
            categoriesIDs: [],
            categorieResponse: [],
            selectedCity: '',
            selectedCategory: '',
            selectecPass: '',
        }
    },

    created() {
       this.fetchPosts()
    },

    methods: {
        searchForPosts(){
            this.fetchCategorie()
        },

        fetchCategorie(){


        this.categoriesIDs = []
        if(this.selectedCity != ''){
        axios.get('http://karlsruher-pass.de/wp-json/wp/v2/categories?search='+ this.selectedCity + '&_embed')
        .then(res => {
            this.categories = res.data
            console.log(this.categories)
            this.categories.forEach(element => {
                if (element.name === this.selectedCity){
                   this.categoriesIDs.push(element.id)
                   this.fetchPosts()
                }
            })
            console.log(this.categoriesIDs)
        })
        .catch(err => console.log(err))
        }

        if (this.selectedCategory != '') {

        axios.get('http://karlsruher-pass.de/wp-json/wp/v2/categories?search='+ this.selectedCategory + '&_embed')
        .then(res => {
            this.categories = res.data
            console.log(this.categories)
            this.categories.forEach(element => {
                if (element.name === this.selectedCategory){
                    this.categoriesIDs.push(element.id)
                    this.fetchPosts()

                }
            })
            console.log(this.categoriesIDs)
        })
        .catch(err => console.log(err))
        }

        if (this.selectecPass != '') {
        axios.get('http://karlsruher-pass.de/wp-json/wp/v2/categories?search='+ this.selectecPass + '&_embed')
        .then(res => {
            this.categories = res.data
            console.log(this.categories)
            this.categories.forEach(element => {
                if (element.name === this.selectecPass){
                   this.categoriesIDs.push(element.id)
                   this.fetchPosts()
                }
            })
            console.log(this.categoriesIDs)
        })
        .catch(err => console.log(err))
        }
        },

        fetchPosts(){
        
        var categorieString = this.categoriesIDs.join()
        console.log(this.categoriesIDs.length)
        console.log(categorieString)
        axios.get('http://karlsruher-pass.de/wp-json/wp/v2/posts?categories='+ categorieString + '&per_page=10&page=' + this.postPage + '&_embed')
        .then(res => {
            this.posts = res.data
            this.postsLoaded = false
            console.log(this.posts)
            console.log("hi")
        })

        .catch(err => console.log(err))      
        },

        getSelectedField(item){
                console.log(item.target.name)
            if (item.target.name === 'city'){
                this.selectedCity = item.target.value
            }
            if (item.target.name === 'category'){
                this.selectedCategory = item.target.value
            }
            if (item.target.name === 'pass'){
                this.selectecPass = item.target.value
            }


            console.log(this.selectedCity,this.selectedCategory, this.selectecPass)
        }
    },


    components: {
        Select,
        Post,
    }
}
</script>