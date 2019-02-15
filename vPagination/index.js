import pagination from './vPagination.vue'

const vPagination = {
  install: function( Vue ){
    Vue.component( 'v-pagination' , pagination );
  }
};

export default vPagination;
