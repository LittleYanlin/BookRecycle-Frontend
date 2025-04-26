import { defineStore } from "pinia";
export const useGloble=defineStore('globle',{
    state(){
        return{
          isCollapse:false,
        }
    }
})