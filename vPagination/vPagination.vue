<template>
    <div class = "paginationDiv">
        <div class="loading" v-show="showLoading">
            <span>加载中</span>
        </div>
        <div class="shade" v-show="showLoading"></div>
        <div class = "pagination" v-show="total>0">
            <button class = "pagination_first" @click = "toPage(1)" >
            {{option.indexTxt}}</button >
            <button class = "pagination_previous" :class = "{'disabled': current <= 1}"
                    @click = "toPage(current - 1)" >&nbsp;</button >
            <button  :class = "{'active':current == i}"
                    v-for = "i in indexes" @click = "toPage(i)" >{{i}}</button >
            <button class = "pagination_next" :class = "{'disabled': current >= pageTotal}"
                    @click = "toPage(current + 1)" >&nbsp;</button >
            <button class = "pagination_last" @click = "toPage(pageTotal)" >{{option.lastTxt}}</button >
            <!-- -->
            <div class = "select_num" v-show = "option.hasSel" >
                <ul class = "pagination_sel" :class = '{true:"sel_val_show",false:"sel_val_hide"}[onClk]'
                    @mouseleave = "paginationSel()" >
                    <li class = "pagination_sel_opt" v-for = "i in option.selNumList"
                        :class = "{'isSeled':i == displaySize}" @click = "setPageSize(i)">{{i}}</li >
                </ul >
                <input class = "pagination_sel_val"
                       :class = '{true:"sel_val_show",false:"sel_val_hide"}[onClk]'
                       @click = "paginationSel()" readonly v-model="displaySize"/>&nbsp;条
            </div >
            <span >&nbsp;跳至
                <input class = "pagination_curr" v-model = "target"
                       @keydown = "toKeyPage" >
                /&nbsp;
                <span class = "pagination_total" >{{pageTotal}}</span >
                页
            </span >
            <button class = "pagination_jump" @click = "toPage(target)" >跳转</button >
        </div >
    </div >
</template>
<script>
/**
 * 示例:<v-pagination :conf="pageConf" :total="total" :current-page='currentPage' :page-size="pageSize"
 @pagechange="pagechange"></v-pagination>
 pageConf中可进行对应配置 可为null 默认配置为{
        indexTxt: "首页" ,
        lastTxt: "尾页" ,
        displayLength: 5 ,//插件中显示可直接跳转的长度 indexes的最大长度，最小为1的整数
        hasLoading: false ,//是否有等待加载中的显示
        hasSel: false ,//是否可选每页多少条记录
        selNumList: [ 10 , 15 ,20 , 25 , 30 , 50] ,//下拉框中的对应数据
      }
 total:不可为空 默认为0 列表总条数
 currentPage:不能为空 默认为1 当前页数
 pageSize:每页多少条 可为null 默认为10
 */
export default {
  name: 'vPagination',
  data () {
    return {
      current : this.currentPage||1,//当前页数
      displaySize: this.pageSize || this.option.selNumList[0],
      showLoading : false,//加载中显示与否
      target : 1,//跳转页数，即页面内输入框的值
      onClk : false,//是否点击选择每页多少条，为false
      option:{
        indexTxt: "首页" ,
        lastTxt: "尾页" ,
        displayLength: 5 ,//插件中显示可直接跳转的长度 indexes的最大长度，最小为1的整数
        hasLoading: false ,//是否有等待加载中的显示
        hasSel: false ,//是否可选每页多少条记录
        selNumList: [ 10 , 15 ,20 , 25 , 30 , 50] ,//下拉框中的对应数据
      }
    }
  },
  props:{
    conf:{
      type: Object,
      default: function(){
        return null;
      }
    },
    total: {// 数据总条数
      type: Number,
      required: true,
      default: 0
    },
    currentPage: {// 当前页码
      type: Number,
      required: true,
      default: 1
    },
    pageSize:{// 每页显示条数
      type: Number,
      default: 10
    }
  },
  computed: {
    pageTotal(){// 总页数
      return Math.ceil(this.total / this.displaySize);
    },
    indexes(){
      const self=this;
      let option = self.option,
        pageTotal = self.pageTotal;
      let list = [];
      let start = self.current - Math.floor( option.displayLength / 2 );
      let end = self.current + Math.floor( option.displayLength / 2 );
      if ( start <= 1 ) {
        start = 1;
        end = start + option.displayLength - 1;
        if ( end > pageTotal ) {
          end = pageTotal;
        }
      }
      if ( end > pageTotal - 1 ) {
        end = pageTotal;
        start = end - option.displayLength + 1;
        if ( start <= 1 ) {
          start = 1;
        }
      }
      for ( var i = start; i <= end; i++ ) {
        list.push( i );
      }
      return list;
    }
  },
  watch: {
    total:function( val ){
      const self = this;
      if(Number(val)>=0){
        self.current=1;
      }
      self.toPage(1,true);
    },
    displaySize:function( val ){
      const self = this;
      if(Number(val)>=0){
        self.current=1;
      }
      self.toPage(1,true);
    },
    currentPage:function( val ){
      const self = this;
      if(Number(val)>=0 && self.current!=Number(val)){
        self.current=Number(val);
        self.toPage(self.current,true);
      }
    },
    pageSize:function( val ){
      const self = this;
      if(Number(val)>=0){
        self.displaySize=val;
        self.current=1;
      }
    }
  },
  created(){
    const self = this;
    self.initFn();
  },
  methods: {
    initFn(){
      const self = this;
      if(self.conf.indexTxt && self.conf.indexTxt != '' ){
        self.option.indexTxt=self.conf.indexTxt;
      }
      if(self.conf.lastTxt && self.conf.lastTxt != '' ){
        self.option.indexTxt=self.conf.indexTxt;
      }
      if(self.conf.displayLength && Number( self.conf.displayLength ) >0 ){
        self.option.displayLength=Number( self.conf.displayLength );
      }
      if(self.conf.hasLoading != null ){
        self.option.hasLoading=self.conf.hasLoading;
      }
      if(self.conf.hasSel != null ){
        self.option.hasSel=self.conf.hasSel;
      }
      if(self.conf.selNumList && self.conf.selNumList.length>0 ){
        self.option.selNumList=self.conf.selNumList;
      }
      if(self.pageSize && Number( self.pageSize ) >0 ){
        self.displaySize=Number( self.pageSize );
      }
      if(self.option.selNumList[0]!=self.displaySize){
        let idx=self.option.selNumList.indexOf(self.displaySize);
        if(idx>-1){
          self.option.selNumList.splice(idx,1);
        }
        self.option.selNumList.unshift(self.displaySize);
      }
    },
    toPage( curr , flag ) {
      const self=this;
      curr=Number( curr );
      if ( isNaN( curr ) ) {
        this.target = this.current;
      } else {
        self.target = curr;
        if ( self.target > self.pageTotal || self.target < 1 ) {
          self.target = 1;
          return;
        }
        if ( self.target == self.current && !flag ) {
          return;
        }
        self.current = self.target;
        if(self.option.hasLoading){
          self.timer=setTimeout(function(){
            self.showLoading=true;
          }, 500);
        }
        this.$emit('pagechange', this.current,this.displaySize);
      }
    },
    showLoadingFn:function(  ){
      var self=this;
      if(self.option.hasLoading && !self.showLoading){
        self.timer=setTimeout(function(){
          self.showLoading=true;
        }, 500);
      }
    },
    closeLoadingFn:function(  ){
      var self=this;
      setTimeout.cancel( self.timer);
      self.showLoading=false;
    },
    toKeyPage: function ( event ) {
      if ( event.keyCode == 13 ) {
        this.toPage( this.target );
      }
    },
    paginationSel:function(  ){
      this.onClk=!this.onClk;
    },
    setPageSize:function( i ){
      const self=this;
      self.displaySize=i;
    }
  }
}
</script>
<style >
.paginationDiv {
  margin-top: 20px;
  display: block;
  text-align: center;
  font-size: 12px;
  box-sizing: border-box !important;
}
.paginationDiv .pagination button {
  font-family: "Microsoft YaHei";
  min-width: 40px;
  cursor: pointer;
  border: 1px solid #dddddd;
  border-radius: 2px;
  text-align: center;
  background-color: #ffffff;
  font-size: 12px;
  height: 30px;
  line-height: 28px;
  padding: 0 12px;
  margin-left: 10px;
  display: inline-block;
}
.paginationDiv .pagination button.pagination_previous,
.paginationDiv .pagination button.pagination_previous:disabled:hover,
.paginationDiv .pagination button.pagination_previous.disabled:hover {
  background: url("images/shape3.png") no-repeat scroll center transparent;
  background-origin: content-box;
}
.paginationDiv .pagination button.pagination_next,
.paginationDiv .pagination button.pagination_next:disabled:hover,
.paginationDiv .pagination button.pagination_next.disabled:hover {
  background: url("images/shape4.png") no-repeat scroll center transparent;
  background-origin: content-box;
}
.paginationDiv .pagination button.pagination_previous:hover {
  background: url("images/shape3_p.png") no-repeat scroll center transparent;
  background-origin: content-box;
  background-color: #3896f8;
}
.paginationDiv .pagination button.pagination_next:hover {
  background: url("images/shape4_p.png") no-repeat scroll center transparent;
  background-origin: content-box;
  background-color: #3896f8;
}
.paginationDiv .pagination button:disabled, .paginationDiv .pagination button:disabled:hover,
.paginationDiv .pagination button.disabled, .paginationDiv .pagination button.disabled:hover {
  color: #d2d2d2;
  background-color: #ffffff;
  border: 1px solid #dddddd;
  cursor: not-allowed;
}
.paginationDiv .pagination button:hover, .paginationDiv .pagination button.active {
  background-color: #3896f8;
  color: #ffffff;
  border: 1px solid #3896f8;
}
.paginationDiv .pagination .pagination_curr {
  box-sizing: border-box !important;
  width: 50px;
  height: 30px;
  font-size: 12px;
  border: 1px solid #dddddd;
  border-radius: 2px;
  /*padding: 0 10px;*/
  margin: 0 10px;
  text-align: center;
}
.paginationDiv .pagination .select_num {
  position: relative;
  display: inline-block;
  margin: 0 10px;
}
.paginationDiv .pagination .select_num > .pagination_sel_val {
  box-sizing: border-box;
  display: inline-block;
  width: 45px;
  height: 30px;
  line-height: 27px;
  cursor: pointer;
  text-align: center;
  border: solid 1px #dddddd;
  border-radius: 2px;
  overflow: hidden;
  padding: 0;
  padding-right: 20px;
}
.paginationDiv .pagination .select_num > .pagination_sel_val.sel_val_show {
  background: url("images/shape2.png") no-repeat scroll 28px 11px transparent;
}
.paginationDiv .pagination .select_num > .pagination_sel_val.sel_val_hide {
  background: url("images/shape1.png") no-repeat scroll 28px 11px transparent;
}
.paginationDiv .pagination .select_num > .pagination_sel {
  position: absolute;
  list-style: none;
  text-align: center;
  background-color: #ffffff;
  border: solid 1px #dddddd;
  border-radius: 2px;
  bottom: 30px;
  margin: 0;
  padding: 0;
  margin-bottom: 2px;
}
.paginationDiv .pagination .select_num > .pagination_sel.sel_val_hide {
  display: none;
}
.paginationDiv .pagination .select_num > .pagination_sel.sel_val_show {
  display: inline-block;
}
.paginationDiv .pagination .select_num > .pagination_sel > .pagination_sel_opt {
  cursor: pointer;
  text-align: left;
  width: 26px;
  height: 23px;
  line-height: 23px;
  padding-left: 18px;
  overflow: hidden;
}
.paginationDiv .pagination .select_num > .pagination_sel > .pagination_sel_opt.isSeled {
  background: url("images/selected.png") no-repeat 3px 7px;
}
.paginationDiv .pagination .select_num > .pagination_sel > .pagination_sel_opt:hover {
  background-color: #3896f8;
  color: #fff;
}
.paginationDiv .pagination .pagination_total {
  display: inline-block;
  min-width: 20px;
}
.paginationDiv .shade {
  position: fixed;
  _position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #000000;
  filter: alpha(opacity=50);
  -moz-opacity: 0.5;
  opacity: 0.5;
  z-index: 5;
}
.paginationDiv .loading {
  position: fixed;
  width: 120px;
  height: 50px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  background-color: #ffffff;
  left: 45%;
  top: 40%;
  z-index: 6;
}
.paginationDiv .loading > span {
  display: inline-block;
  width: 45px;
  height: 50px;
  line-height: 50px;
  padding-left: 55px;
  background: url(images/loading.gif) no-repeat 5px 9px;
}
</style>
