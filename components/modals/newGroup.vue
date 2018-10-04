<template>
  <b-modal
    v-model="createGroup"
    id="createGroup"
    size="sm"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true">
    <span class="m--font-grey close-modal-btn" @click="close">
      <i class="la la-close"></i>
    </span>
    <h4 class="m--font-blue m-form m--margin-top-10 text-center">
      <span v-if="!editGroup">
        Add a Group
      </span>
      <span v-else>
        Edit Group
      </span>
    </h4>

    <b-form @submit="addGroup" class="m-form m--margin-top-20" novalidate>

      <div class="form-group m-form__group" :class="{'has-danger': (errors.has('Name') || form.error) && form.submitted}">
        <b-form-input id="Name"
                      type="text"
                      v-model="form.fields.name"
                      required
                      v-validate="'required|min:3|max:140'"
                      name="Name"
                      class="m-input"
                      placeholder="Name">
        </b-form-input>
        <div v-show="(errors.has('Name') || form.error) && form.submitted"
             class="form-control-feedback">
          {{form.error || errors.first('Name')}}
        </div>
      </div>
      <b-form-group label="Direction"
                    class="m--margin-top-20"
                    label-class="form-control-label font-13 text-left ">
        <b-form-radio-group class="m-radio-list m-radio-inline"
                            id="direction"
                            v-model="form.fields.direction"
                            name="direction">
          <b-form-radio class="m-radio"
                        :class="{'m--font-info': form.fields.direction === option.value}"
                        v-for="option in options"
                        v-bind:key="option.value"
                        :value="option.value">
            {{option.label}}
            <span></span>
          </b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <button
        v-bind:class="{'m-loader m-loader--light m-loader--right': form.loading}"
        class=" m--margin-top-20 w-100 btn m-btn m--font-transform-u m--font-boldest2 btn-info"
        type="submit">
        <span v-if="!editGroup">
          Add
        </span>
        <span v-else>
          save
        </span>
      </button>
    </b-form>
  </b-modal>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    props: ['createGroup', 'editGroup', 'group'],
    data () {
      let fields = {
        name: '',
        direction: 'unspecified'
      }
      if (this.group) {
        fields = {
          name: this.group.name,
          direction: this.group.direction
        }
      }
      return {
        options: [
          {
            label: 'Unspecified',
            value: 'unspecified'
          },
          {
            label: 'On',
            value: 'on'
          },
          {
            label: 'Off',
            value: 'off'
          }
        ],
        form: {
          loading: false,
          submitted: false,
          error: false,
          fields: fields

        }
      }
    },
    computed: mapState([
      'editGroupModalData'
    ]),
    methods: {
      close () {
        const data = {
          edit: false,
          open: false
        }
        this.$store.dispatch('editGroupModal', data)
      },
      addGroup (evt) {
        evt.preventDefault()

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true

          let crewId = this.editGroupModalData.crewId
          let groupId = this.editGroupModalData.gropId

          if (result) {
            let request
            this.form.loading = true

            if (this.editGroup) {
              request = this.$store.dispatch('editGroup', {
                crewId,
                groupId,
                form: this.form.fields
              })
            }
            else {
              request = this.$store.dispatch('createGroup', {id: crewId, data: this.form.fields})
            }

            request
              .then(() => {
                if (this.editGroup) {
                  this.$store.dispatch('getGroupDetails', {crewId, groupId})
                }
                this.$store.dispatch('getCrewGroupList', crewId).then(() => this.close())
              })
              .finally(() => {
                this.form.loading = false
              })
          }
        })
      }
    },
    name: 'new-group'
  }
</script>

<style scoped>

</style>
