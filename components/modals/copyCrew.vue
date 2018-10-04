<template>
  <b-modal
    v-model="show"
    id="copyCrew"
    size="sm"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    class="text-center">
        <span class="m--font-grey close-modal-btn" @click="close">
          <i class="la la-close"></i>
        </span>
    <h4 class="m--font-blue m-form m--margin-top-10">
      <span>
        Duplicate Crew Change
      </span>
    </h4>

    <b-form @submit="copyCrew" class="m-form m--margin-top-20" novalidate>

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
        <span>
          Duplicate
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
      'crew'
    ],
    computed: mapState([
      'copyList'
    ]),
    data() {
      return {
        form: {
          fields: {
            name: `Copy of ${this.crew.name}`
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
          crew: null
        };
        this.$store.dispatch('copyCrewModal', data);
      },
      copyCrew(evt) {
        evt.preventDefault();

        this.$validator.validateAll().then((result) => {
          this.form.submitted = true;

          if (result) {
            const data = {
              data: {"name": this.form.fields.name},
              id: this.crew.id
            };

            this.$store.dispatch('crewCopy', data)
              .then((res) => {
                if (this.$route.params.crewId) {
                  return this.$store.dispatch('getCrewDetails', res.id)
                    .then(() => {
                      this.close();
                      this.$router.push(`/manage-crew-changes/${res.id}`);
                  })
                } else {
                  this.close();
                  return this.$store.dispatch('getCrewList', {});
                }
              })
              .catch(error => {
//                this.form.error = error.body.form.children.name.errors[0];
                console.log(error);
              })
          }

        });
      }
    },
    name: "copy-crew"
  }
</script>

<style scoped>

</style>
