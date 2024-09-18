<script>
import Map from '@/base_components/Map.vue';
import { blocks, isBlockWalkable } from '@/globals.js';

export default {
    components: {
        Map,
    },
    props: {
        playerX: Number,
        playerY: Number,
        direction: String,
        mapMoving: Boolean,
        inGrass: Boolean,
        clickUp: Boolean,
        clickDown: Boolean,
        clickLeft: Boolean,
        clickRight: Boolean,
        clickA: Boolean,
        clickB: Boolean,
        inWildEncounter: Boolean,
        menuVisible: Boolean,
        movementType: String,
        isUnknow: Boolean,
        pokedexOpen: Boolean,
        pokedex: Object,
        pokemonRegister: Object,
    },
    watch: {
        clickUp(value) {
            this.handleDirectionClick('up', value);
        },
        clickDown(value) {
            this.handleDirectionClick('down', value);
        },
        clickLeft(value) {
            this.handleDirectionClick('left', value);
        },
        clickRight(value) {
            this.handleDirectionClick('right', value);
        },
        clickA(value) {
            if (value && !this.inWildEncounter) {
                if (blocks[this.playerY + 1][this.playerX] === 10 && this.canUnknow()) {
                    this.fetchUnknow();
                } else if (blocks[this.playerY][this.playerX + 1] === 10 && this.canUnknow()) {
                    this.fetchUnknow();
                } else if (blocks[this.playerY - 1][this.playerX] === 10 && this.canUnknow()) {
                    this.fetchUnknow();
                }
            }
        },
    },
    methods: {
        async fetchEnter() {
            try {
                const responseEnter = await fetch('http://localhost:8081/enter_grass', { method: 'GET' });
                if (responseEnter.status === 200 || responseEnter.status === 400) {
                    this.$emit('update:inGrass', true);
                    if (responseEnter.status === 400 && !this.menuVisible) {
                        this.$emit('update:inWildEncounter', true);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },
        async fetchLeave() {
            try {
                const responseLeave = await fetch('http://localhost:8081/leave_grass', { method: 'GET' });
                if (responseLeave.status === 200) {
                    this.$emit('update:inGrass', false);
                }
            } catch (error) {
                console.error(error);
            }
        },
        async fetchUnknow() {
            try {
                const responseUnknow = await fetch('http://localhost:8081/my_status_code_is_unknown', { method: 'GET' });
                if (responseUnknow.status === 201) {
                    console.log('Unknow');
                    this.$emit('update:inWildEncounter', true);
                    this.$emit('update:isUnknow', true);
                }
            } catch (error) {
                console.error(error);
            }
        },
        handleEnteredGrass() {
            this.fetchEnter();
        },
        handleExitedGrass() {
            this.fetchLeave();
        },
        movePlayer(direction ) {
            if(this.finishMoving && !this.inWildEncounter && !this.menuVisible && !this.pokedexOpen ){
            let destinationX = this.playerX;
            let destinationY = this.playerY;
            let playerDirection = this.direction;

            switch (direction) {
                case 'up':
                    destinationY -= 1;
                    playerDirection = 'north';
                    break;
                case 'down':
                    destinationY += 1;
                    playerDirection = 'south';
                    break;
                case 'left':
                    destinationX -= 1;
                    playerDirection = 'west';
                    break;
                case 'right':
                    destinationX += 1;
                    playerDirection = 'east';
                    break;
            }

            const destinationBlock = blocks[destinationY][destinationX];
            if (isBlockWalkable[destinationBlock]) {
                this.$emit('update:initialInfo', { x: destinationX, y: destinationY, direction: playerDirection, pokedex: this.pokemonRegister});
            } else {
                this.$emit('update:initialInfo', { x: this.playerX, y: this.playerY, direction: playerDirection, pokedex:this.pokemonRegister });
            }
            this.$emit('update:movementType', 'walking');
            this.$emit('update:mapMoving', true);
            }


        },
        handleMapStartMoving() {
            this.finishMoving = false;
        },
        handleMapStoppedMoving() {
            this.finishMoving = true;
            this.$emit('update:movementType', 'standing');
            if (this.clickUp && this.finishMoving) this.movePlayer('up');
            if (this.clickDown && this.finishMoving) this.movePlayer('down');
            if (this.clickLeft && this.finishMoving) this.movePlayer('left');
            if (this.clickRight && this.finishMoving) this.movePlayer('right');
        },
        handleDirectionClick(direction, value) {
            if (value && this.finishMoving) {
                this.movePlayer(direction);
            } else {
                this.stopMoving();
            }
        },
        stopMoving() {
            this.$emit('update:movementType', 'standing');
        },
        canUnknow(){
            let x=0;
            for (let pokemonId in this.pokemonRegister){
                x++;
            }
            if(x==2){
                return true;
            }
            else{
                return false
            }

        }

    },
    data() {
        return {
            finishMoving: true,

        };
    },
};
</script>

<template>
    <div>
        <Map 
            :playerX="playerX" 
            :playerY="playerY" 
            @on-entered-grass="handleEnteredGrass" 
            @on-exited-grass="handleExitedGrass" 
            @on-started-moving="handleMapStartMoving()" 
            @on-finished-moving="handleMapStoppedMoving()"
        />
    </div>
</template>
