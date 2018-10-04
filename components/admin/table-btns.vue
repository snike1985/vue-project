<template>
  <div class="row align-items-center no-gutters buttons-table-container flex-nowrap">
    <div class="col-auto"
         v-if="showCopy">
      <button @click="copyCrew"
              class="btn m--margin-right-10 m--font-transform-u m-btn--icon btn-sm m-btn--icon-only m--font-boldest2 btn-sm btn-outline-grey">
        <i class="la la-copy"></i>
      </button>
    </div>

    <div class="col-auto">
      <button
        class="btn test m--font-transform-u m--margin-right-10 m-btn--icon btn-sm m-btn--icon-only m--font-boldest2 btn-sm btn-outline-info"
        @click="onEdit">
        <i class="la font-16 la-pencil"></i>
      </button>
    </div>

    <div class="col-auto">
      <button
        class="btn m--font-transform-u m--margin-right-10 m-btn--icon btn-sm m-btn--icon-only m--font-boldest2 btn-sm btn-outline-danger"
        :id="'deletePopover' + item.id"
        @click="$event.preventDefault(); $root.$emit('bv::hide::popover')">
        <i class="la font-16 la-trash-o"></i>
      </button>

      <b-popover placement="bottom"
                 :ref="'deletePopover' + item.id"
                 :target="'deletePopover' + item.id">
        <div class="light-popover">
          <span class="m--font-grey close-modal-btn"
                @click="closePopover()">
            <i class="la font-16 la-close"></i>
          </span>
          <p class="m--font-boldest" v-html="deleteText"></p>
          <button
            @click="onDelete"
            class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
            {{deleteBtn}}
          </button>
        </div>
      </b-popover>
    </div>

    <div class="col-auto" v-if="!hideLogin">
      <button class="font-12 btn m--font-transform-u m--font-boldest2 btn-sm btn-outline-success"
              @click="onLogin">
        <span>
          Login
        </span>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'table-btns',
    props: ['item',
      'deleteText',
      'deleteBtn',
      'loginLoader',
      'hideLogin',
      'showCopy'
    ],
    methods: {
      copyCrew() {
        console.log(this.item);
        this.$emit('onCopy', this.item);
      },
      onEdit() {
        this.$emit('edit')
      },
      onDelete() {
        this.$root.$emit('bv::hide::popover')

        this.$emit('delete')
      },
      onLogin() {
        this.$emit('login')
      },
      closePopover () {
        const ref = 'deletePopover' + this.item.id
        this.$refs[ref].$emit('close')
      },
    }
  }
</script>

