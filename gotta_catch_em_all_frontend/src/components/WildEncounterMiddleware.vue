<script>
import WildEncounter from '@/base_components/WildEncounter.vue';

export default {
    components: {
        WildEncounter,
    },
    data() {
        return {
            inWildEncounter: false,
            state: 'START',
            selectorPos: 0,
            pokemonId: 0,
            isPokemonOwned: false,
                  
        };
    },
    props: {
        sawPokemons: Array,
        pokedex: Object,
        clickUp: Boolean,
        clickDown: Boolean,
        clickA: Boolean,
        clickB: Boolean,
        isUnknow: Boolean,
    },
    watch: {
        clickUp(value) {
            if (value) {
                this.handleMovementOption();
            }
        },
        clickDown(value) {
            if (value) {
                this.handleMovementOption();
            }
        },
        clickA(value) {
            if (value) {
                this.handleBottonAOptions();
            }
        },
        clickB(value) {
            if (value) {
                this.handleBottonBOptions();
            }
        },
    },
    mounted() {
        if(this.isUnknow && this.pokedex[201] === undefined){
            this.pokemonId = 201;
        }else{
            const rand = Math.floor(Math.random() * 10);
            this.pokemonId = rand < 5 ? 16 : 19;
        }

        //mirar si el pokemon ya fue visto y sino poner la id del pokemon
        for(let pokemonId in this.sawPokemons){
            if(this.sawPokemons[pokemonId] === false || this.sawPokemons[pokemonId] === undefined){
                this.sawPokemons[pokemonId] = true;
                this.$emit('update:sawPokemons', this.sawPokemons);
                break;
            }
        }
        this.isPokemonOwned = this.pokedex[this.pokemonId] !== undefined;
    },
    methods: {
        handleMovementOption() {
            if(this.clickUp){
                this.selectorPos--;
                if(this.selectorPos < 0){
                    this.selectorPos = 1;
                }
            }
            if(this.clickDown){
                this.selectorPos++;
                if(this.selectorPos > 1){
                    this.selectorPos = 0;
                }
            }
        },
        handleBottonAOptions() {
            if (this.clickA) {
                if(this.selectorPos === 0 ){
                    switch (this.state) {
                        case 'START':
                            this.state = 'MAIN';
                            this.$emit('update:sawPokemons', {
                                    ...this.sawPokemons,
                                    [this.pokemonId]: true,
                                });
                            break;
                        case 'MAIN':
                            switch (this.selectorPos) {
                                case 0:
                                    this.state = 'CATCHING';
                                    this.capturePokemon();
                                    break;
                                case 1:
                                    this.state = 'RUNNING_AWAY';
                                    break;
                            }
                            break;
                        case 'RUNNING_AWAY':

                        case 'CAUGHT':
                            this.$emit('update:inWildEncounter', false);
                            if(!this.isPokemonOwned){
                                this.$emit('update:pokedex', {
                                    ...this.pokedex,
                                    [this.pokemonId]: true,
                                });

                            }
                            break;
                    }
                }else{
                    if(this.selectorPos === 1){
                        this.state = 'RUNNING_AWAY';
                        switch (this.state) {
                            case 'RUNNING_AWAY':
                                this.$emit('update:inWildEncounter', false);
                                this.$emit('update:isUnknow', false);
                                break;
                    }
                    }

                
                }
            }
        },
        handleBottonBOptions() {
            if (this.state === 'START') {
                this.state = 'MAIN';
            }
        },
        capturePokemon() {
            fetch('http://localhost:8081/capture', {
                method: 'GET',
            })
            .then(response => {
                if (response.ok) {
                    this.state = 'CAUGHT';
                } else {
                    this.state = 'MAIN';
                }
            })
            .catch(error => {
                console.error('Error capturing Pokemon:', error);
            });
        },
    },
};
</script>

<template>
    <WildEncounter
        :pokemonId="pokemonId"
        :isPokemonOwned="isPokemonOwned"
        :selectorPos="selectorPos"
        :state="state"
        @onError="onError"
        @onFinished="onFinished"
        @onPokemonCaught="onPokemonCaught"
    />
</template>

<style></style>
