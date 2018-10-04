<template>
  <b-modal
    v-model="show"
    id="changePass"
    size="sm"
    :class="'medium-dialog'"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true">
    <span class="m--font-grey close-modal-btn" @click="close">
      <i class="la 	la-close"></i>
    </span>
    <h4 class="m--font-blue m-form m--margin-top-10 text-center">
      Auto-create Groups
    </h4>

    <b-form @submit="create" class="m-form m--margin-top-20" novalidate>

      <error-form :show="error.show"
                  :error-message="error.message"
                  @closeError="closeError"/>

      <b-alert show variant="warning">
        Note that this operation will remove all existing groups.
      </b-alert>

      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('matches') && form.submitted}"
                    label="Please specify the minimum number of common Stops"
                    label-for="matches">
        <b-form-input id="matches"
                      type="number"
                      v-model="form.matches"
                      min="1"
                      max="10"
                      v-validate="'required|min:1|max:10'"
                      required
                      data-vv-as="Minimum number of common Stops"
                      placeholder="Minimum number of common Stops"
                      name="matches"
                      minlength="8"
                      maxlength="64"
                      class="m-input">
        </b-form-input>
        <div v-show="form.submitted && errors.has('matches')" class="form-control-feedback">
          {{errors.first('matches')}}
        </div>
      </b-form-group>

      <button
        class=" m--margin-top-20 w-100 btn m-btn m--font-transform-u m--font-boldest2 btn-info"
        v-bind:class="{'m-loader m-loader--light m-loader--right': form.loading}"
        type="submit">
        Create
      </button>

    </b-form>

  </b-modal>

</template>

<script>
  import errorForm from '../Error'

  export default {
    components: {errorForm},
    props: [
      'show',
      'crewId'
    ],
    data () {
      return {
        form: {
          matches: 1,
          loading: false,
          error: null,
          submitted: false
        },
        error: {
          show: false,
          message: null
        }
      }
    },
    methods: {
      close () {
        const data = {
          open: false
        };
        this.$store.dispatch('autoCreateGroupModal', data)
      },
      create (e) {
        e.preventDefault();

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true;

          if (result) {
            this.form.loading = true;

            this.$store.dispatch('createAutoGroup', {id: this.crewId, matches: this.form.matches})
              .then((res) => {
                this.updateGroupList();
              })
              .catch(rej => {
                this.renderError(rej)
              })
          }
        })
      },
      updateGroupList() {
        this.$store.dispatch('getCrewGroupList', this.crewId)
          .then((res) => {
            this.close();
          })
          .catch(rej => {
            this.renderError(rej)
          })
          .finally(() => this.form.loading = false)
      },
      closeError() {
        this.error.show = false;
      },
      renderError(rej) {
        let errorData = rej;

        const model = [
          {
            columnName: 'Name',
            columnValues: ['Andrew','Max','Artem']
          },
          {
            columnName: 'Count',
            columnValues: ['1','2','3']
          },
        ];

        this.error.show = true;
        this.form.loading = false;

        if (errorData.body.message) {
          this.error.message = errorData.body.message;
        } else {
          this.error.message = errorData.error.description;
        }

        if (errorData.error.code === 500) {
          return this.error.message = 'Server Error';
        }

        this.$store.getters.formValidation(rej.body.form, this.errors)
      }
    },
    name: 'auto-create-groups'
  }
</script>

<style scoped>

</style>
