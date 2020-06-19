<template>
  <v-container class="postContent">
    <v-row>
      <v-row class="PostSelectWrapper" row wrap>
        <v-col md="3">
          <Select
            ref="citySelect"
            class="PostSelect"
            :selectItems="[
                                    {'key':'','value': 'Choose..'},
                                    {'key':'','value': 'All'},
                                    {'key':'bruchsal-en', 'value':'Bruchsal'},
                                    {'key':'eggenstein-leopoldshafen-en','value':'Eggenstein-Leopoldshafen'},
                                    {'key': 'karlsruhe-en', 'value': 'Karlsruhe'},
                                    {'key': 'pfinztal-en', 'value': 'Pfinztal'},
                                    {'key': 'rheinstetten-en', 'value': 'Rheinstetten'},
                                    {'key': 'stutensee-en', 'value': 'Stutensee'},
                                    {'key': 'waldbronn-en', 'value': 'Waldbronn'},
                                    {'key': 'walzbachtal-en', 'value': 'Walzbachtal'},
                                    {'key': 'weingarten-en', 'value': 'Weingarten'}]"
            :label="'Stadt'"
            :selectName="'city'"
            @getSelectedField="getSelectedField"
          />
        </v-col>
        <v-col md="3">
          <Select
            ref="categorySelect"
            class="PostSelect"
            :selectItems="[
                                    {'key':'', 'value': 'Choose..'},
                                    {'key':'', 'value': 'All'},
                                    {'key': 'mobilitaet-en','value':'Mobility'},
                                    {'key': 'freizeit-en', 'value': 'Free Time'},
                                    {'key': 'musik-en', 'value': 'Music'},
                                    {'key': 'sport-en', 'value': 'Sports'},
                                    {'key': 'theater-en', 'value': 'Theatre'},
                                    {'key': 'bildung-en', 'value': 'Education'},
                                    {'key': 'einkaufen-en', 'value': 'Shopping'},
                                    {'key': 'essen-en', 'value': 'Food'},
                                    {'key': 'information-en', 'value': 'Info'}]"
            :label="'Kategorie'"
            :selectName="'category'"
            @getSelectedField="getSelectedField"
          />
        </v-col>
        <v-col md="3">
          <Select
            ref="passSelect"
            class="PostSelect"
            :selectItems="[
                                {'key': '', 'value':'All'},
                                {'key':'karlsruher-pass-en','value':'Karlsruher Pass'},
                                {'key': 'karlsruher-pass-60plus-en', 'value': 'Karlsruher Pass 60Plus'},
                                {'key': '60plus-gutscheine-en', 'value': '60Plus Gutscheine'},
                                {'key': 'kinderpass-en', 'value': 'Karlsruher Kinderpass'}]"
            :label="'Pass'"
            :selectName="'pass'"
            @getSelectedField="getSelectedField"
          />
        </v-col>
        <v-col class="SearchButtonWrapper" md="2">
          <v-btn rounded class="SearchButton" @click="fetchCategory()" dark>SEARCH</v-btn>
        </v-col>
      </v-row>
    </v-row>
    <Post :posts="posts" />
    <v-row>
      <v-col md="5" offset-md="5">
        <v-btn v-if="!isLoading" class="LoadMoreButton" @click="loadMore()">LOAD MORE</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import axios from "axios";
import Post from "./Post";
import Select from "./Select";
import _ from "underscore";
export default {
  data() {
    return {
      currentPage: 1,
      pageCount: 5,
      posts: [],
      selectCity: "",
      selectCategory: "",
      selectPass: "",
      categoriesIDs: [],
      isLoading: false
    };
  },

  components: {
    Post,
    Select
  },

  async mounted() {
    if (this.$route.query.city != undefined) {
      this.selectCity = this.$route.query.city;
      this.$refs.citySelect.preSelect(this.selectCity);
      this.fetchCategory();
    } else {
      if (this.$route.query.category != undefined) {
        this.selectCategory = this.$route.query.category;
        this.$refs.categorySelect.preSelect(this.selectCategory);
        this.fetchCategory();
      } else {
        if (this.$route.query.pass != undefined) {
          this.selectPass = this.$route.query.pass;
          this.$refs.passSelect.preSelect();
          this.fetchCategory();
        } else {
          this.fetchCategory();
        }
      }
    }
  },

  methods: {
    loadMore() {
      this.currentPage += 1;
      this.fetchPosts();
    },
    getSelectedField(item) {
      if (item.target.name === "city") {
        this.selectCity = item.target.value;
      }

      if (item.target.name === "category") {
        this.selectCategory = item.target.value;
      }

      if (item.target.name === "pass") {
        this.selectPass = item.target.value;
      }
    },

    async fetchCategory() {
      this.isLoading = true;

      this.categoriesIDs = [];
      this.posts = [];
      if (this.selectCity != "") {
        try {
          const { data } = await axios.get(
            "https://karlsruher-pass.de/wp-json/wp/v2/categories?search=" +
              this.selectCity
          );
          data.forEach(element => {
            if (element.slug === this.selectCity.toLowerCase()) {
              this.categoriesIDs.push(element.id);
            }
            this.isLoading = false;
          });
        } catch (error) {
          throw error;
        }
      }

      if (this.selectCategory != "") {
        try {
          const { data } = await axios.get(
            "https://karlsruher-pass.de/wp-json/wp/v2/categories?search=" +
              this.selectCategory
          );
          data.forEach(element => {
            if (element.slug === this.selectCategory.toLowerCase()) {
              this.categoriesIDs.push(element.id);
            }
          });
        } catch (error) {
          throw error;
        }
      }
      if (this.selectPass != "") {
        try {
          const { data } = await axios.get(
            "https://karlsruher-pass.de/wp-json/wp/v2/categories?search=" +
              this.selectPass
          );
          data.forEach(element => {
            if (element.slug === this.selectPass.toLowerCase()) {
              this.categoriesIDs.push(element.id);
            }
          });
        } catch (error) {
          throw error;
        }
      }
      this.fetchPosts();
    },

    async fetchPosts() {
      var url;
      // categories_exclude=1734 entfernt alle deutschen Kategorien
      // categories_exclude=1922 entfernt alle englischen Kategorien
      if (this.categoriesIDs.length === 0) {
        url = `https://karlsruher-pass.de/wp-json/wp/v2/posts?per_page=9&page=${this.currentPage}&categories_exclude=1734&_embed`;
      } else {
        var categorieString = this.categoriesIDs.join();
        url = `https://karlsruher-pass.de/wp-json/wp/v2/posts?per_page=9&page=${this.currentPage}&categories=${categorieString}&categories_exclude=1734&_embed`;
      }
      try {
        this.isLoading = true;
        const { data } = await axios.get(url);
        data.forEach(element => {

            // Hier werden alle IDs die in categorieIDs enthalten sind verglichen mit element.categories. Ein neues Array mit gefundenen IDs kommt zurück.
          var x = _.intersection(this.categoriesIDs, element.categories);
          if (JSON.stringify(x) == JSON.stringify(this.categoriesIDs)) {
            this.posts.push(element);
          }
        });
        this.isLoading = false;
      } catch (error) {
        throw error;
      }
    },

    checkContainCategorie(categorieArray) {
      categorieArray.forEach(el => {
        console.log(el);
      });
    }
  }
};
</script>

<style scoped>
.PostSelect {
  padding: 15px;
}

.PostSelectWrapper {
  margin-left: 5%;
  margin-right: auto;
}

.SearchButton {
  height: 45px !important;
  width: 300px !important;
  margin-top: 20px;
  margin-left: -30px;
}

.SearchButtonWrapper {
  margin: auto;
}

.LoadMoreButton {
  width: 300px;
}
</style>
