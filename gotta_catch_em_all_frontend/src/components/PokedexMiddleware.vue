<script>
    import Pokedex from '@/base_components/Pokedex.vue';
    
    export default {
    components: {
        Pokedex,
    },
    data() {
        return {
            pokemonsInfo: [],
            auxOwn: 0,
            auxSeen: 0,
        };
    },
    props: {
        clickB: Boolean,
        pokedex: Object,
        sawPokemons: Array,
        pokedexOpen:Boolean,
        menuVisible:Boolean,
    },
    watch:{
        clickB(value){
            if(value){
                this.$emit('update:pokedexOpen', false)
                this.$emit('update:menuVisible', true)
            }
        },
    },
    methods: {
        handlePokedex() {
            const newPokemonsInfo = [];
            for (const pokemonId in this.pokedex) {
                let name = "";
                switch (parseInt(pokemonId)) {
                    case 16:
                        name = "Pidgey";
                        break;
                    case 19:
                        name = "Rattata";
                        break;
                    case 201:
                        name = "Unown";
                        break;
                    default:
                        name = "Unknown";
                }
                const pokemon = {
                    id: pokemonId,
                    name: name,
                    owned: this.pokedex[pokemonId],
                };
                newPokemonsInfo.push(pokemon);
            }
            this.pokemonsInfo = newPokemonsInfo; 
        },
        pokemonsOwned() {
            let auxOwn = 0;
            for (const pokemon of this.pokemonsInfo) {
                auxOwn += pokemon.owned;
            }
            return auxOwn;
        },
        pokemonsSeen() {
            let auxSeen = 0;
            for (const pokemonId in this.sawPokemons) {
                auxSeen += this.sawPokemons[pokemonId];
            }
            return auxSeen;
        },
    },
    mounted() {
        this.handlePokedex(); 
    },
};

</script>

<template>
    <div>
        <Pokedex 
            :numberOfOwnedPokemons="pokemonsOwned()"
            :numberOfSeenPokemons="pokemonsSeen()"
            :pokemonsInfo="this.pokemonsInfo"
        />
    </div>
</template>
