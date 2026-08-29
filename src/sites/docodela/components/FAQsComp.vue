<template>

<div id="faqs" class="q-py-md" style="padding-top:100px; padding-bottom:100px; background-color: #fff;  ">

<div class="row justify-center items-center q-col-gutter-xl q-mt-xl" style="">



    <div class="col-md-10 col-12 row ">

      <div
        class="text-weight-bold q-mb-md text-grey-9 text-center col-12"
        :style="{ fontSize: '50px' }"
      >
        FAQs
      </div>

      <label class=" q-px-xl text-h5">
        Answers to some of the common questions about financing your treament with Chrysalis
      </label>

      <div
        class=" col-12 text-h6"
      >
        <div class="q-pa-md" style="max-width: 100%">
          <q-list bordered>
            <q-expansion-item
              group="somegroup"
              label="First"
              default-opened
              header-class="text-primary"
            >
              <q-card>
                <q-card-section>
                  {{ tdc('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem,  eius reprehenderit eos corrupti commodi magni quaerat ex numquam,  dolorum officiis modi facere maiores architecto suscipit iste  eveniet doloribus ullam aliquid.') }}
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="somegroup"
              label="First"
              default-opened
              header-class="text-primary"
            >
              <q-card>
                <q-card-section>
                  ghjhjh jkjbjkb ikjbikbjk.
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>

      </div>
    </div>

</div>

</div>

</template>

<script>

import { defineComponent, computed, ref } from "vue"
import { tdc,useUserStore } from "quasar_resaas"


export default defineComponent({

components:{

},

setup(){

const User =useUserStore()
const ps = computed(()=>User.ps || {})

const slide= ref(1)



return{
User,
ps,
tdc,
slide,
}

}

})

</script>

<style scoped>
.flip-card-front {
  background: rgba(0, 0, 0, 0.45);
  color: white;
}

.slideoverlay {
  padding: 40px;
  color: white;
  text-align: center;
  max-width: 600px;
}
</style>
