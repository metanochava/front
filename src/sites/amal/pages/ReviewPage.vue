<template>

  <div class="carousel-bg" style="border-radius: 50px;">

    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="white"
      navigation
      padding
      arrows
      class="bg-transparent"
    >

      <q-carousel-slide name="style" class="column no-wrap flex-center">

        <div class="q-mt-md text-center slideoverlay">
          <q-icon name="style" size="56px" /> <br>
          {{ tdc(lorem) }}
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="tv" class="column no-wrap flex-center">

        <div class="q-mt-md text-center slideoverlay">
          <q-icon name="live_tv" size="56px" /><br>
          {{ tdc(lorem) }}
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="layers" class="column no-wrap flex-center">

        <div class="q-mt-md text-center slideoverlay">
          <q-icon name="layers" size="56px" /><br>
          {{ tdc(lorem) }}
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="map" class="column no-wrap flex-center">

        <div class="q-mt-md text-center slideoverlay">
          <q-icon name="terrain" size="56px" /><br>
          {{ tdc(lorem) }}
        </div>
      </q-carousel-slide>

    </q-carousel>

  </div>

</template>

<script>
import { ref } from 'vue'
import { tdc } from "quasar_resaas"

export default {
  setup () {
    return {
      slide: ref('style'),
      tdc,
      lorem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque voluptatem totam.'
    }
  }
}
</script>

<style scoped>

.carousel-bg{
  height:500px;
  background-image:url("../images/13.jpeg");
  background-size:cover;
  background-position:center;
  background-repeat:no-repeat;
  display:flex;
  align-items:center;
  justify-content:center;
}

.slideoverlay{
  background: rgba(0,0,0,0.45);
  padding:40px;
  border-radius:10px;
  color:white;
  max-width:600px;
}

</style>
