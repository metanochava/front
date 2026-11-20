<template>
  <!-- add_product / change_product/:id. The type decides what shows: a
       service has no stock (no minimum stock, no lots); a product with stock
       movements cannot change its type or lot tracking (the serializer's
       locked_fields say why). -->
  <RecordFormShell
    :title="tdc(isEdit ? 'Edit product' : 'New product')"
    icon="inventory" :ready="ready" :saving="saving" :can-save="canSave" :error="generalError"
    test-id="product-form"
    @save="save" @cancel="back"
  >
    <div class="text-subtitle2 text-grey-7 q-mb-xs">{{ tdc('Product type') }}</div>
    <span class="inline-block">
      <q-btn-toggle
        :model-value="type" :options="typeOptions" :disable="!!locked('product_type')"
        no-caps unelevated toggle-color="primary" color="grey-3" text-color="grey-9"
        data-test="f-product_type" @update:model-value="setType"
      />
      <s-tooltip v-if="locked('product_type')">{{ locked('product_type') }}</s-tooltip>
    </span>
    <div v-if="Product.errors.product_type" class="text-negative text-caption">{{ Product.errors.product_type }}</div>

    <div class="text-subtitle2 text-grey-7 q-mt-md q-mb-xs">{{ tdc('Identification') }}</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <s-input v-model="Product.form.nome" :label="tdc('Name')" :error="!!Product.errors.nome" :error-message="Product.errors.nome" data-test="f-nome" />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <s-input v-model="Product.form.codigo" :label="tdc('Code')" :error="!!Product.errors.codigo" :error-message="Product.errors.codigo" data-test="f-codigo" />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <s-input v-model="Product.form.unidade" :label="tdc('Unit')" :hint="tdc('For example: un, kg, l, hour')"
                 :error="!!Product.errors.unidade" :error-message="Product.errors.unidade" data-test="f-unidade" />
      </div>
      <div class="col-12 col-md-6">
        <s-field v-model="Product.form.categoria" :field="fieldOf('categoria')" :label="tdc('Category')"
                 :error="!!Product.errors.categoria" :error-message="Product.errors.categoria" data-test="f-categoria" />
      </div>
      <div class="col-12 col-md-6">
        <s-input v-model="Product.form.preco_base" type="number" min="0" step="0.01" :label="tdc('Base price')"
                 :hint="tdc('A price list may give a customer another price')"
                 :error="!!Product.errors.preco_base" :error-message="Product.errors.preco_base" data-test="f-preco_base" />
      </div>
    </div>

    <!-- stock: goods only -->
    <template v-if="type === 'goods'">
      <div class="text-subtitle2 text-grey-7 q-mt-md q-mb-xs" data-test="product-stock">{{ tdc('Stock') }}</div>
      <div class="row q-col-gutter-md items-center">
        <div class="col-12 col-sm-6">
          <s-input v-model="Product.form.estoque_minimo" type="number" min="0" step="0.001" :label="tdc('Minimum stock')"
                   :hint="tdc('Below it the product shows as low')"
                   :error="!!Product.errors.estoque_minimo" :error-message="Product.errors.estoque_minimo" data-test="f-estoque_minimo" />
        </div>
        <div class="col-12 col-sm-6">
          <span class="inline-block">
            <q-toggle v-model="Product.form.track_batches" :label="tdc('Track lots')" :disable="!!locked('track_batches')" data-test="f-track_batches" />
            <s-tooltip>{{ locked('track_batches') || tdc('Stock is kept per lot, with expiry date') }}</s-tooltip>
          </span>
        </div>
      </div>
    </template>

    <div class="text-subtitle2 text-grey-7 q-mt-md q-mb-xs">{{ tdc('Variant and image') }}</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <s-field v-model="Product.form.variant_of" :field="fieldOf('variant_of')" :label="tdc('Variant of')"
                 :hint="tdc('Only for a size, colour... of another product')"
                 :error="!!Product.errors.variant_of" :error-message="Product.errors.variant_of" data-test="f-variant_of" />
      </div>
      <div class="col-12 col-md-6">
        <s-field v-model="Product.form.imagem" :field="fieldOf('imagem')" :label="tdc('Image')" data-test="f-imagem" />
      </div>
      <div class="col-12">
        <s-toggle v-model="Product.form.ativo" :label="tdc('Active')" data-test="f-ativo" />
      </div>
    </div>
  </RecordFormShell>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { tdc } from 'quasar_resaas'
import RecordFormShell from 'src/components/record/RecordFormShell.vue'
import { useRecordForm } from 'src/components/record/useRecordForm'
import { useProductStore } from './productStore'

const Product = useProductStore()
const { ready, saving, generalError, isEdit, canSave, valueOf, fieldOf, locked, load, back, save } = useRecordForm(Product, {
  model: 'Product',
  defaults: () => ({ product_type: 'goods', ativo: true, track_batches: false })
})

const typeOptions = [
  { label: tdc('Goods'), value: 'goods', icon: 'inventory_2' },
  { label: tdc('Service'), value: 'service', icon: 'handyman' },
]
const type = computed(() => valueOf(Product.form?.product_type))

// a service has no stock: no lots, no minimum stock
function setType (value) {
  Product.form.product_type = value
  if (value === 'service') {
    Product.form.track_batches = false
    Product.form.estoque_minimo = 0
  }
  Product.errors = {}
}

onMounted(load)
</script>
