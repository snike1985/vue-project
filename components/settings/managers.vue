<template>
  <div class="notification-settings dark-title-table m--margin-bottom-30">
    <!-- the modal -->
    <create-manager v-if="createManager.open"
                   :show="createManager.open">
    </create-manager>

    <div class="row align-items-center">
      <div class="col">
        <div class="w-100 m-brand m-brand--skin-dark m--font-light m--font-transform-u m--font-boldest">
          <div class="row w-100 no-gutters justify-content-between align-items-center">
            <div class="col-auto">
              <span class="title m--padding-left-10">
                crew managers
              </span>
            </div>

            <div class="col-auto">
              <button
                @click="openCreateManager"
                class="text-center m-btn--icon btn m-btn m--font-transform-u m--font-boldest2 btn-info"
                type="button">
                <span>
                  <i class="la font-26 la-plus-circle opacity-4"></i>
                  <span>
                    Add crew manager
                  </span>
                  <i class="la la-plus-circle opacity-0"></i>
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
    <div class="m-portlet m--margin-bottom">
      <b-table hovered
               v-if="managersList.items.length"
               :fields="tableFields"
               :items="managersList.items"
               class="table table-with-shadow crew-table member-group m-table m-table--head-bg-light">


        <template slot="phone" slot-scope="data">
          <the-mask class="hide" :mask="['+##(###)###-##-########']" v-model="data.item.phone" :masked="true"/>
          {{data.item.phone}}
        </template>

        <template slot="trash" slot-scope="data">

          <button @click="togglePopover(data.index)"
                  :id="`manager_`+data.item.id+``"
                  class="btn btn-light m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill">
            <i class="la font-16 la-trash-o opacity-6"></i>
          </button>

          <b-popover placement="bottom"
                     offset="-82"
                     :show.sync="data.item.popover"
                     :target="`manager_`+data.item.id+``">

            <div class="light-popover right-arrow">
                  <span class="m--font-grey close-modal-btn"
                        @click="togglePopover(data.index)">
                    <i class="la font-16 la-close"></i>
                  </span>
              <p class="m--font-boldest">
                Are you sure you want to delete <br>
                Crew Manager
              </p>
              <button
                @click="deleteManager(data.item.id, data.index)"
                class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
                Yes, delete Crew Manager
              </button>
            </div>

          </b-popover>

        </template>

      </b-table>

      <no-info v-else></no-info>
    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import noInfo from '../../components/crewManager/no-info'
  import CreateManager from '../modals/createManager'
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    computed: mapState([
      'managersList',
      'createManager'
    ]),
    data () {
      return {
        showDeletePopover: [],
        tableFields: {
          name: {
            label: 'name',
            sortable: true
          },
          username: {
            label: 'email'
          },
          phone: {
            label: 'Phone Number'
          },
          trash: {
            label: ' '
          }
        },
      }
    },
    created() {
      this.fillManagersModel();
    },
    beforeUpdate() {
      this.fillManagersModel();
    },
    methods: {
      fillManagersModel() {

        for( let item of this.managersList.items) {
          item.popover = false;
        }
      },
      togglePopover( curIndex ) {
        let cloneList = cloneDeep(this.managersList.items);

        for( let [index, item] of cloneList.entries()) {

          if (curIndex === index) {
            item.popover = !item.popover
          }else{
            item.popover = false;
          }
        }

        this.managersList.items = cloneList
      },
      deleteManager(id, index) {
        this.managersList.items[index].popover = false;
        this.$store.dispatch('deleteManager', id).then(() => {})
      },
      openCreateManager (ev) {
        ev.preventDefault();

        const data = {
          open: true
        };
        this.$store.dispatch('createManagerModal', data)
      },
    },
    components: {
      CreateManager,
      noInfo
    },
    head () {
      return {
        title: 'Crew managers - Settings'
      }
    },
    name: 'managers'
  }
</script>

<style scoped>

</style>
