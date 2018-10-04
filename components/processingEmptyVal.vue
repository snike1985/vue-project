<template>
  <div v-if="!link" :class="{'m--font-metal': (!val || val == '0')}">
    {{(val && val != '0') ? val : '—'}}
  </div>

  <div v-else>
    <div v-if="!val || val == '0'" class="m--font-metal">
      —
    </div>

    <nuxt-link v-else
               :to="link"
               class="word-break m--font-boldest2 m--font-blue cursor-pointer">
      {{val}}
    </nuxt-link>
  </div>

</template>

<script>
  export default {
    props: ['val', 'link'],
    name: 'empty-val'
  }
</script>
