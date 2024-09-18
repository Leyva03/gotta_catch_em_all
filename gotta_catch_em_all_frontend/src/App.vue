<script>
import ControlsFrame from './base_components/ControlsFrame.vue';
import MapMiddleware from './components/MapMiddleware.vue';
import PlayerMiddleware from './components/PlayerMiddleware.vue';
import MenuMiddleware from './components/MenuMiddleware.vue';
import WildEncounterMiddleware from './components/WildEncounterMiddleware.vue';
import PokedexMiddleware from './components/PokedexMiddleware.vue';

export default {
    components: {
        ControlsFrame,
        MapMiddleware,
        PlayerMiddleware,
        MenuMiddleware,
        WildEncounterMiddleware,
        PokedexMiddleware,
    },
    data() {
        return {
            initialInfo: {
                x: 0,
                y: 0,
                direction: "",
                pokedex: {},
            },
            mapMoving: false,
            menuVisible: false,
            inWildEncounter: false,
            movementType: "standing",
            buttonTimer:null,
            savingGame: false,
            inGrass: false,
            clickRight:false,
            clickLeft:false,
            clickDown: false,
            clickUp: false,
            clickA:false,
            clickB:false,
            pokemonRegister:{},
            pokedexOpen:false,
            onStartedMoving:false,
            onFinishedMoving:false,
            sawPokemons:{
                16: true,
                19: true,
                201: true,
            },
            isUnknow:false,
        };
    },
    mounted() {
        this.fetchInitialInfo();
    },
    watch: {
 /*        calculatedMapMoving(value) {
            if (!this.inWildEncounter && !this.menuVisible) {
                this.movementType = value ? "walking" : "standing";
            }
        }, */
        calculatedMovement() {
            this.calculatedMovement= this.mapMoving ? "walking" : "standing";
        
        },
        menuVisible(value) {
            if (value) {
                this.movementType = "standing";
            }
        },
        inWildEncounter(value) {
            if (value) {
                this.movementType = "standing";
            }
        },
        
    },
    methods: {
        async fetchInitialInfo() {
            try {
                const response = await fetch('http://localhost:8081/initial_info', {
                    method: 'GET',
                });
                const data = await response.json();
                this.initialInfo.x = data.x;
                this.initialInfo.y = data.y;
                this.initialInfo.direction = data.direction;
                this.initialInfo.pokedex = data.pokedex;
                this.pokemonRegister= data.pokedex;
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        },
        handleMovementUp(pressed){
            this.clickUp = pressed;
        },

        handleMovementDown(pressed) {
            this.clickDown = pressed;
        },

        handleMovementRight(pressed) {
            this.clickRight = pressed;
        },

        handleMovementLeft(pressed) {
            this.clickLeft = pressed;
        },

        handleButtonA(pressed){
            this.clickA = pressed;
        },
        handleButtonB(pressed){
            this.clickB = pressed;
        },
        handleButtonMenu(pressed){
            if(this.inWildEncounter || this.savingGame || this.pokedexOpens || (this.menuVisible && pressed)){
                this.menuVisible = false;
            }else{
                if(pressed)
                    this.menuVisible = true;
            }
        },
    },
};
</script>


<template>
    <div v-if="initialInfo">
        <ControlsFrame 
        @onMovementUp="handleMovementUp" 
        @onMovementDown="handleMovementDown" 
        @onMovementLeft="handleMovementLeft" 
        @onMovementRight="handleMovementRight" 
        @onButtonA="handleButtonA" 
        @onButtonB="handleButtonB" 
        @onButtonMenu="handleButtonMenu"/>
        <MapMiddleware
            :playerX="initialInfo.x"
            :playerY="initialInfo.y"
            :mapMoving="mapMoving"
            :inGrass="inGrass"
            :clickUp="clickUp"
            :clickDown="clickDown"
            :clickRight="clickRight"
            :clickLeft="clickLeft"
            :clickA="clickA"
            :menuVisible="menuVisible"  
            :direction="initialInfo.direction"
            :inWildEncounter="inWildEncounter"
            :isUnknow="isUnknow"
            :pokedexOpen="pokedexOpen"
            :pokedex="pokemonRegister"
            :pokemonRegister="pokemonRegister"
            @update:initialInfo="initialInfo = $event"
            @update:movementType="movementType = $event"
            @update:mapMoving="mapMoving = $event"
            @update:inGrass="inGrass = $event" 
            @update:inWildEncounter="inWildEncounter = $event"
            @update:isUnknow="isUnknow = $event"
        />
        <PlayerMiddleware 
            :facingDirection="initialInfo.direction" 
            :movementType="this.movementType" 
            :mapMoving="mapMoving" 
            :menuVisible="menuVisible" 
            :inWildEncounter="inWildEncounter"/>
        <MenuMiddleware v-if="menuVisible"
            :menuVisible="menuVisible"
            :inWildEncounter="inWildEncounter"
            :savingGame="savingGame"
            :playerX="initialInfo.x"
            :playerY="initialInfo.y"
            :facingDirection="initialInfo.direction"
            :pokedex="pokemonRegister" 
            :clickUp="clickUp"
            :clickDown="clickDown"
            :clickA="clickA"
            :clickB="clickB"
            :pokedexOpen="pokedexOpen"
            @update:menuVisible="menuVisible = $event"
            @update:savingGame="savingGame= $event"
            @update:pokedexOpen="pokedexOpen= $event"/>
        <WildEncounterMiddleware v-if="inWildEncounter && !menuVisible && !pokedexOpen "
            :clickUp="clickUp"
            :clickDown="clickDown"
            :clickA="clickA"
            :clickB="clickB"
            :pokedex="pokemonRegister"
            :sawPokemons="sawPokemons"
            :isUnknow="isUnknow"
            @update:inWildEncounter="inWildEncounter = $event"
            @update:sawPokemons="sawPokemons = $event"
            @update:pokedex="pokemonRegister = $event"
            @update:isUnknow="isUnknow = $event"

            
        />
        <PokedexMiddleware v-if="pokedexOpen"
            :clickB="clickB"
            :sawPokemons="sawPokemons"
            :pokedex="pokemonRegister"
            :pokedexOpen="pokedexOpen"
            :menuVisible="menuVisible"
            @update:pokedex="initialInfo.pokedex = $event"
            @update:sawPokemons="sawPokemons = $event"
            @update:pokedexOpen="pokedexOpen = $event"
            @update:menuVisible="menuVisible = $event"
            
            />

    </div>
</template>

<style>
</style>

<!--             if(presed){
    const movePlayerUp=()=>{
        const destinationY = this.initialInfo.y - 1;
        const destinationX = this.initialInfo.x;
        const blockValue = blocks[destinationY][destinationX];
        
        if (presed && isBlockWalkable[blockValue]) {
            this.initialInfo.y = destinationY;
            this.initialInfo.direction = "north";
            this.mapMoving = true;
            this.movementType = "walking";
        }
    }
    movePlayerUp();
}
    
else{
    this.mapMoving = false;
    this.movementType = "standing";
}  -->