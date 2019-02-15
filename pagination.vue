<template>
    <div>
    	<a href="!#/pageDetail">点击至分页详情</a>
      <button @click="changePageSize">changePageSize</button>
      <button @click="changeCurrent">changeCurrent</button>
      <v-pagination :conf="pageConf" :total="total" :current-page='currentPage' :page-size="pageSize"
                    @pagechange="pagechange"></v-pagination>
    </div>
</template>
<script>
export default {
  name:'list',
  data(){
    return {
      pageConf:{
        hasSel:true
      },
      total:0,
      currentPage:1,
      pageSize:20
    }
  },
  created(){
    const self=this;
    self.pagechange(self.currentPage,self.pageSize);
  },
  methods:{
    pagechange(current,displaySize){
      this.currentPage=current;
      this.pageSize=displaySize;
      console.log('change',current,displaySize)
      this.total=63;
    },
    changePageSize(){
      this.pageSize=15;
    },
    changeCurrent(){
      this.currentPage=2;
    }
  }
}
</script>
