<template>
    <div>
     <label :for="selectName"> {{label}}</label>
     <select :name="selectName" @change="onChange($event)" label="city" v-model="key" >
       <option v-for="(selectItem, index) in selectItems" :value="selectItem.key" :key="index" > {{selectItem.value}} </option>
     </select>
    </div>
</template>


<script>
export default {
    props :{
        selectItems: Array,
        selectName: String,
        label: String,
    },
    data(){
        return {
            key : '',
            items: ['1','2']
        }
    },

    methods: {

        preSelect(name) {
            this.key = name
        },
        
        onChange(event){
            this.$emit('getSelectedField',event)
        }
    },
    
}
</script>


<style scoped>
label {
    color: #c80029;
}

select {
border: 1px solid #fab500;
-moz-border-radius: 10px;
-webkit-border-radius: 10px;
border-radius: 10px;
font-size:13px;
}
</style>