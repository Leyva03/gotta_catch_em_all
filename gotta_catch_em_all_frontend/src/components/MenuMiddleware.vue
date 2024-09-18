<script>
import Menu from '@/base_components/Menu.vue'
export default{
    components:{
        Menu,
    },
    props:{
        menuVisible:Boolean,
        inWildEncounter:Boolean,
        savingGame:Boolean,
        pokedexOpen:Boolean,
        playerX:Number,
        playerY:Number,
        facingDirection:String,
        pokedex:Object,
        clickUp:Boolean,
        clickDown:Boolean,
        clickA:Boolean,
        clickB:Boolean,
        pokedexOpen:Boolean,
    },
    data(){
        return{
            menuState:'START',
            selectorPos:0,
        }
    },
    watch:{
        clickUp(value){
            if(value){
                this.handleMenuMovementOption();
            }
        },
        clickDown(value){
            if(value){
                this.handleMenuMovementOption();
            }
        },
        clickA (value){
            if(value){
                this.handleBottonAOptions();
            }
        },
        clickB (value){
            if(value){
            this.handleBottonBOptions();}

        }


    },
    methods:{
        handleSaveOption(){
            try{
                fetch('http://localhost:8081/save',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        x:this.playerX,
                        y:this.playerY,
                        direction:this.facingDirection,
                        pokedex:this.pokedex,
                    }),
                });
            }
            catch(error){
                console.error(error);
            }
        },
        handleMenuMovementOption(){
            if(this.clickUp){
                this.selectorPos--;
                if(this.selectorPos<0){
                    this.selectorPos=2;
                }
                
            }
            if(this.clickDown){
                this.selectorPos++;
                if(this.selectorPos>2){
                    this.selectorPos=0;
                }
            
            }
            
        },
        handleBottonAOptions(){
            if(this.menuState==='START'){
                switch(this.selectorPos){
                    case 0:
                        this.$emit('update:menuVisible', false);
                        this.$emit('update:pokedexOpen', true);
                        break;
                    case 1:
                        this.menuState='SAVING';
                        this.handleSaveOption();
                        this.$emit('update:savingGame', true);
                        this.menuState='SAVED';
                        break;
                    case 2:
                        this.$emit('update:menuVisible', false);
                        break;
                }
            }
            else{
            if(this.menuState==='SAVED'){
                this.$emit('update:savingGame', false);
                this.$emit('update:menuVisible', false);
            }
        }
        },
        handleBottonBOptions(){
            if(this.menuState==='START'){
                this.$emit('update:menuVisible', !this.menuVisible);
            }
            else if(this.menuState==='SAVED'){
                this.$emit('update:pokedexOpen', false);
                this.$emit('update:menuVisible', false);
            }
            
        }


    },
    
}
</script>
<template>
    <Menu
        :selectorPos="this.selectorPos" 
        :state="this.menuState"
    />

</template>
<style>
</style>