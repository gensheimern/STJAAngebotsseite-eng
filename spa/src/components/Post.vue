<template>
    <v-container>
        <v-layout row wrap>
            <v-flex class="postWrapper" xs12 md4 v-for="post in posts" :key="post.id">
                <v-card flat class="mx-auto"  max-width="350px">
                    <v-img :src="post._embedded['wp:featuredmedia']['0'].source_url">
                        
                    </v-img>
                    <v-flex class="cardText" >
                    <h6 v-html="post.title.rendered"></h6>
                    <v-spacer />
                    <v-flex class="post_content" v-html="post.content.rendered"> </v-flex>
                    </v-flex>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    props: {
        posts: Array
    },
    data(){
        return {

        }
    },



    
}
</script>

<style scoped>
.post_content {
    font-size: smaller;
}
.postWrapper, .cardText {
    background-color: #fefbe1;
}

h2 {
    color: #c80029;
}
.cardText {
    padding: 15px 15px 15px 15px;
}

.postWrapper {
    padding: 30px 30px 30px 30px;
    transition: all .2s ease-in-out;

}

.postWrapper:hover {
transform: scale(1.1);
}

.v-image {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}


</style>