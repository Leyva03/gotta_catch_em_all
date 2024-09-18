<script>
    import Player from '@/base_components/Player.vue';
    export default{
        components:{
            Player,
        },
        props:{
            facingDirection: String,
            movementType: String,
            mapMoving: Boolean,
            menuVisible: Boolean,
            inWildEncounter: Boolean,
        }, 
    }
</script>

<template>
    <div>
        <Player :facing="facingDirection" :movementType="movementType"/>
    </div>
</template>


<style>

</style>
