<template>
  <b-modal
    v-model="show"
    id="createCrew"
    size="sm"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    class="text-center">
        <span class="m--font-grey close-modal-btn" @click="close">
          <i class="la 	la-close"></i>
        </span>
    <h4 class="m--font-blue m-form m--margin-top-10">
      <span v-if="!edit">
        Create Crew Change
      </span>
      <span v-else>
        Edit Crew Change
      </span>
    </h4>

    <b-form @submit="createNewCrew" class="m-form m--margin-top-20" novalidate>

      <div class="form-group m-form__group" :class="{'has-danger': errors.has('Name') || form.error}">
        <b-form-input id="Name"
                      type="text"
                      v-model="form.fields.name"
                      required
                      @input="form.error = null"
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


      <button
        class=" m--margin-top-20 w-100 btn m-btn m--font-transform-u m--font-boldest2 btn-info"
        type="submit">
        <span v-if="!edit">
          Create
        </span>
        <span v-else>
          Save
        </span>
      </button>
    </b-form>
  </b-modal>
</template>

<script>
  import { mapState } from 'vuex'
  import findIndex from 'lodash/findIndex'

  export default {
    props: [
      'show',
      'edit',
      'crew'
    ],
    computed: mapState([
      'crewList'
    ]),
    data() {
      return {
        form: {
          fields: {
            name: this.edit ? this.crew.name : ''
          },
          error: null,
          submitted: false
        },
      }
    },
    methods: {
      close() {
        const data = {
          open: false,
          edit: false,
          crew: null
        };
        this.$store.dispatch('createCrewModal', data);
      },
      createNewCrew(evt) {
        evt.preventDefault();

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true;

          if (result) {
            const data = {
              form: this.form.fields,
              id: this.edit ? this.crew.id : null
            };

            this.$store.dispatch('createCrew', data)
              .then((res) => {
                if (!this.edit) {
                  return this.$store.dispatch('getCrewList', {}).then(() => this.close())
                }

                if(this.edit && !this.$route.params.groupId) {
                  const index = findIndex(this.crewList.items, {id: res.body.id})
                  this.crewList.items[index] = {
                    ...this.crewList.items[index],
                    ...res.body
                  }
                  return this.close()
                }

                this.$store.commit('SET_CREW_DETAILS', res.body)
                this.close()

              })
              .catch(error => {
                this.form.error = error.body.form.children.name.errors[0];
              })
          }

        });
      }
    },
    name: "add-crew"
  }
</script>

<style scoped>

</style>
