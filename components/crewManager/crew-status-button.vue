<template>
    <div class="d-flex align-items-center flex-nowrap m--margin-left-10">
      <button v-if="!superAdmin"
              @click="copyCrew(crew)"
              class="m--margin-left-15 btn m--font-transform-u m-btn--icon btn-sm m-btn--icon-only m--font-boldest2 btn-sm btn-outline-grey">
        <i class="la la-copy"></i>
      </button>
      <button :id="'finishedPopover' + crew.id"
              @click="$event.preventDefault(); $root.$emit('bv::hide::popover')"
              class="m--margin-left-15 btn m--font-transform-u m-btn--icon btn-sm m-btn--icon-only m--font-boldest2 btn-sm btn-outline-success">
        <i class="la la-check"></i>
      </button>
      <button :id="'cancelPopover' + crew.id"
              @click="$event.preventDefault(); $root.$emit('bv::hide::popover')"
              class="m--margin-left-15 btn m--font-transform-u m-btn--icon btn-sm m-btn--icon-only m--font-boldest2 btn-sm btn-outline-danger">
        <i class="la la-close"></i>
      </button>

      <b-popover placement="bottom"
                 :ref="'cancelPopover' + crew.id"
                 :target="'cancelPopover' + crew.id">
        <div class="light-popover">
          <span class="m--font-grey close-modal-btn"
                @click="closePopover(crew, 'cancel')">
            <i class="la font-16 la-close"></i>
          </span>
          <p class="m--font-boldest">
            Are you sure you want <br>
            to delete this crew change?
          </p>
          <button
            @click="changeStatus(crew.id, 'cancelled')"
            class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
            Yes, change status
          </button>
        </div>
      </b-popover>

      <b-popover placement="bottom"
                 :ref="'finishedPopover' + crew.id"
                 :target="'finishedPopover' + crew.id">
        <div class="light-popover">
          <span class="m--font-grey close-modal-btn"
                @click="closePopover(crew, 'finished')">
            <i class="la font-16 la-close"></i>
          </span>
          <p class="m--font-boldest">
            Are you sure you want<br>
            to finish the Crew Change?
          </p>
          <button
            @click="changeStatus(crew.id, 'finished')"
            class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
            Yes, change status
          </button>
        </div>
      </b-popover>
    </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState([
      'superAdmin',
    ]),
    props: ['crew'],
    methods: {
      copyCrew(crew) {
        this.$emit('onCopy', crew);
      },
      closePopover(crew, type) {
        const ref = type + 'Popover' + crew.id;
        this.$refs[ref].$emit('close')
      },
      changeStatus(id, status) {
        this.$emit('changeStatus', id, status)
      }
    },
    name: 'crew-status-button'
  }
</script>

<style scoped>

</style>
