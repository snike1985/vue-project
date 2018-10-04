<template>
  <!--CONTENT-->
  <div class="m-grid__item m-grid__item--fluid m-wrapper crew-managers">
    <div class="m-content">
      <div class="row">
        <div class="col-md-10 offset-1 d-flex justify-content-between align-items-start crew-managers__head">

          <div>
            <h4 class="m--font-dark">
              Crew Managers
            </h4>

            <p class="crew-managers__text">Only people in the list below can manage this crew</p>
          </div>

          <button class="btn m--margin-left-10 btn-primary m--font-transform-u m--font-boldest2 crew-managers__btn"
                  id="assignNewManager"
                  @click="showSearchPopover">
              Assign manager
          </button>
            <b-popover placement="bottomleft"
                       offset="-84"
                       :show.sync="visibleSearchPopover"
                       :target="'assignNewManager'">

                <div class="light-popover assign-manager">
                    <div class="assign-manager__search">
                        <input type="text"
                               placeholder="Search by name or email"
                               v-model="searchValue">
                        <span v-if="searchClose" class="m--font-grey assign-manager__search-clear"
                              @click="clearSearch">
                            <i class="la font-16 la-close"></i>
                        </span>
                    </div>
                    <div class="assign-manager__result"
                         v-if="filteredManagers.length">
                        <div class="assign-manager__result-item"
                             v-for="manager in filteredManagers"
                             :key="manager.id"
                             @click="addManager(manager.id)">
                            <strong class="assign-manager__result-name">{{ manager.name }}</strong>
                            <div class="assign-manager__result-email"
                                 v-if="manager.contactEmail">
                                {{ manager.contactEmail }}
                            </div>
                        </div>
                    </div>
                    <div class="assign-manager__no-result"
                         v-if="!filteredManagers.length">
                        No managers found
                    </div>
                </div>
            </b-popover>
        </div>
      </div>
      <div class="row">
        <div class="col-md-10 offset-1">
            <div class="crew-managers__layout">

                <b-table
                        :fields="crewManagersTableFields"
                        :items="crewManagersList"
                        v-if="crewManagersList.length"
                        class="table crew-managers-table m-table m-table--head-bg-light table-with-shadow">

                    <template slot="name" slot-scope="data">
                        {{data.item.manager.name}}
                    <div v-if="data.item.manager.contactEmail">{{ data.item.manager.contactEmail }}</div>
                    </template>

                    <template slot="date" slot-scope="data">
                  <span v-if="data.item.manager.updatedAt">
                    {{data.item.manager.updatedAt * 1000 | date('DD.MM.YYYY')}} at {{data.item.manager.updatedAt * 1000 | date('HH:MM')}}
                  </span>
                        <span class="m--font-grey" v-else>
                    dates not set
                  </span>
                    </template>

                    <template slot="btns" slot-scope="data">
                        <div class="d-flex justify-content-end">
                            <button
                                    class="btn btn-sm btn-outline-danger m--font-transform-u m--font-boldest2"
                                    :id="`unassign_${data.index}`"
                                    @click="unassign($event, data.index)">
                                Unassign
                            </button>
                            <b-popover placement="bottomleft"
                                       offset="-45"
                                       :show.sync="popovers[data.index]"
                                       :target="`unassign_${data.index}`">

                                <div class="light-popover unassign-popover">
                                    <button class="btn btn-danger d-block m--font-transform-u m--font-boldest2 crew-managers__btn"
                                            @click="removeManager(data.item.manager.id)">
                                        Unassign
                                    </button>
                                    <button class="btn btn-outline-info d-block m--font-transform-u m--font-boldest2 crew-managers__cancel"
                                            @click="hidePopovers">
                                        Cancel
                                    </button>
                                </div>
                            </b-popover>
                        </div>
                    </template>

                </b-table>

                <div v-else>
                    <div class="no-info-container text-center">
                        <img src="/images/no-info.svg" alt="">
                        <h3 class="m--font-blue m--font-boldest2">No information</h3>
                        <p class="m--font-blue">Add managers you want to manage this crew</p>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {

    fetch ({store, route}) {
      return store.dispatch('getCrewManagers', route.params.crewId)
        .then(() => store.dispatch('getCrewGroupList', route.params.crewId))
        .then(() => store.dispatch('getAllManagers'));
    },
    data () {
      return {
        crewManagersTableFields: {
          name: {
            label: 'Name'
          },
          date: {
            label: 'Assign date'
          },
          btns: {
            label: ' '
          }
        },
        visibleSearchPopover: false,
        popovers: [],
        crewId: this.$route.params.crewId,
        searchValue: '',
        searchClose: false,
        crewManagersIdList: []
      }
    },
    computed: {
      ...mapState([
        'crewManagersList',
        'allManagersList'
      ]),
      filteredManagers () {
        const showingManagersId = this.getManagersId();
        const showingManagers = this.allManagersList.filter(({id}) => showingManagersId.includes(id));

        this.changingSearch();

        return showingManagers.filter(manager => {
            const name = manager.name ? manager.name.toLowerCase() : '';
            const contactEmail = manager.contactEmail ? manager.contactEmail.toLowerCase() : '';

            return name.indexOf(this.searchValue.toLowerCase()) > -1 || contactEmail.indexOf(this.searchValue.toLowerCase()) > -1
        })
      }
    },
    watch: {},
    mounted: function () {
      this.hidePopovers();
    },
    methods: {
      changingSearch() {
        if (this.searchValue != '') {
          this.searchClose = true;
        } else {
          this.searchClose = false;
        }
      },
      clearSearch() {
        this.searchClose = false;
        this.searchValue = '';
      },
      getManagersId() {
          this.crewManagersIdList = this.crewManagersList.map(item => item.manager.id);
          const allManagersId = this.allManagersList.map(({id}) => id);

          return allManagersId.filter((id) => !this.crewManagersIdList.includes(id));
      },
      hidePopovers() {
        this.visibleSearchPopover = false;
        this.popovers = this.crewManagersList.map(() => false);
      },
      showSearchPopover() {
        this.hidePopovers();
        this.visibleSearchPopover = !this.visibleSearchPopover
      },
      unassign(ev, index) {
        ev.preventDefault();
        this.togglePopover(index)
      },
      togglePopover(curIndex) {
        this.hidePopovers();
        this.popovers[curIndex] = !this.popovers[curIndex];
      },
      removeManager (id) {
        this.$store.dispatch('removeCrewManager', {crewId: this.crewId, managerId: id})
          .then(() => {
            console.log('removed manager');
            this.hidePopovers();
            this.$store.dispatch('getCrewManagers', this.crewId)
              .then((res) => {
//                console.log(res);
//                console.log(this.crewManagersList)
                this.crewManagersList = res;
              });
          })
      },
      addManager(id) {
        this.$store.dispatch('addCrewManager', {id: this.crewId, data: {"manager": id}})
          .then(() => {
            console.log('added manager');
            this.hidePopovers();
            this.$store.dispatch('getCrewManagers', this.crewId)
              .then((res) => {
//                console.log(res);
//                console.log(this.crewManagersList);
                this.crewManagersList = res;
              });
          })
      }
    },
    components: {},
    layout: 'crew-details',
    head () {
      return {
        title: 'Assign Crew Managers'
      }
    },
    name: 'assign-crew-managers'
  }
</script>

<style lang="sass" scoped>
    @import '../../../../assets/scss/no-info'
    @import '../../../../assets/scss/crew/crew-managers'
</style>
