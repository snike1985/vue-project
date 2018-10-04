<template>

  <b-modal
    v-model="contactsOpen"
    id="contactInfo"
    size="lg"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    class="no-padding contacts-modal">

    <span class="m--font-grey close-modal-btn"
          @click="close">

      <i class="la la-close"></i>

    </span>

    <h4 class="m--font-blue m--margin-top-10 m--margin-bottom-25 text-center contacts-title">
      Contact Information
    </h4>

    <error-form :show="error.show"
                :error-message="error.message"
                @closeError="closeErrorAlert">

    </error-form>

    <b-form @submit="createContact"
            class="m-form m--margin-bottom-20 contacts-form"
            novalidate>

      <div class="row">

        <b-form-group class="m-form__group col"
                      :class="{'has-danger': errors.has('Agent') && submitted}"
                      label="Agent"
                      label-class="form-control-label"
                      label-for="Agent">

          <b-form-input id="Agent"
                        @input="onChange"
                        type="text"
                        v-model="form.name"
                        name="Agent"
                        class="m-input"
                        v-validate="'required|min:2|max:140'"
                        placeholder="Name">
          </b-form-input>

          <div v-show="(errors.has('Agent') || form.error) && submitted"
               class="form-control-feedback">
            {{form.error || errors.first('Agent')}}
          </div>

        </b-form-group>

        <b-form-group class="m-form__group col"
                      :class="{'has-danger': errors.has('email') && submitted}"
                      label="Email"
                      label-for="Email">
          <b-form-input id="Email"
                        @input="onChange"
                        type="email"
                        v-validate="'required|email'"
                        v-model="form.email"
                        required
                        data-vv-as="Email"
                        name="email"
                        class="m-input"
                        placeholder="Email Address">
          </b-form-input>
          <div v-show="submitted && errors.has('email')"
               class="form-control-feedback">
            {{errors.first('email')}}
          </div>
        </b-form-group>

        <div class="col">

          <div class="row">

            <b-form-group class="m-form__group col"
                          :class="{'has-danger': errors.has('phone') && submitted}"
                          label="Phone"
                          label-for="Phone">

              <the-mask v-model="form.phone"
                        id="Phone"
                        @input="onChange(errors)"
                        data-vv-as="Phone"
                        name="phone"
                        v-validate="'required|min:10'"
                        class="m-input form-control"
                        placeholder="+XX(XXX)XXX-XX-XX"
                        :mask="['+##(###)###-##-########']">
              </the-mask>

              <div v-if="errors.has('phone') && submitted"
                   class="form-control-feedback">
                {{errors.first('phone') || 'Invalid Phone number'}}
              </div>

            </b-form-group>

            <div class="col-btn" v-if="crewDetails.status !== 'cancelled' && crewDetails.status !== 'finished'">

              <button class="btn-add"
                      @click="createContact"
                      type="submit"
                      :disabled="isSending">

                <i class="la la-plus"></i>

              </button>

            </div>

          </div>

        </div>

      </div>

    </b-form>

    <div class="table-wrapper">

      <div class="table-wrapper__table">

        <div class="contacts-table__loading m-loader m-loader--center" v-if="pageLoading"></div>

        <b-table
          v-if="contactsItems && contactsItems[0]"
          :fields="crewTableFields"
          :items="contactsItems"
          class="table contacts-table m-table m-table--head-bg-light-2 m--margin-bottom-25">

          <template slot="name" slot-scope="data">

            <span class="m--font-boldest m--font-dark block">{{data.item.name}}</span>

          </template>

          <template slot="email" slot-scope="data">

            <a :href="`mailto:${data.item.email}`" class="m--font-dark">{{data.item.email}}</a>

          </template>

          <template slot="phone" slot-scope="data">

            <the-mask class="hide" :mask="['+##(###)###-##-########']" v-model="data.item.phone" :masked="true"/>

            <a :href="`tel:${data.item.phone}`" class="m--font-dark">{{data.item.phone}}</a>

          </template>

          <template slot="showAs" slot-scope="data">

            <div class="contacts-show-us">

              <b-form-checkbox v-model="data.item.showAsContact"
                               class="m-checkbox"
                               value="true"
                               unchecked-value="false"
                               @change="changeShowAs(data.index, data.item)">
                <span></span>
              </b-form-checkbox>

              <button class="btn-delete"
                      v-if="crewDetails.status !== 'cancelled' && crewDetails.status !== 'finished'"
                      :id="`contact_`+data.item.id+``"
                      @click="togglePopover(data.index)">
                <i class="la la-minus"></i>
              </button>

              <b-popover placement="bottom"
                         offset="-71"
                         :show.sync="data.item.popover"
                         :target="`contact_`+data.item.id+``">

                <div class="light-popover right-arrow">
                  <span class="m--font-grey close-modal-btn"
                        @click="togglePopover(data.index)">
                    <i class="la font-16 la-close"></i>
                  </span>
                  <p class="m--font-boldest">
                    Are you sure you want to delete <br>
                    Contact
                  </p>
                  <button
                    @click="deleteContact(data.index, data.item.id)"
                    class="btn m-btn btn-sm m--font-transform-u m--font-boldest2 btn-outline-danger">
                    Yes, delete Contact
                  </button>
                </div>

              </b-popover>

            </div>

          </template>

        </b-table>

      </div>

      <button type="button"
              @click="close"
              class="btn m-btn m--font-transform-u m--font-boldest2 btn-info">
        Done
      </button>

    </div>

  </b-modal>

</template>

<script>
  import cloneDeep from 'lodash/cloneDeep'
  import errorForm from '../Error'
  import {mapState} from 'vuex'

  export default {
    components: {
      errorForm
    },
    props: ['contactsOpen', 'crewId'],
    name: 'contacts-info',
    computed: mapState([
      'crewDetails'
    ]),
    data() {
      return {
        contactsItems: null,
        crewTableFields: {
          name: {
            label: 'Agent'
          },
          email: {
            label: 'Email'
          },
          phone: {
            label: 'Phone'
          },
          showAs: {
            label: 'Show as Contact'
          }
        },
        form: {
          name: '',
          email: '',
          phone: '',
          error: null,
        },
        submitted: false,
        isSending: false,
        error: {
          show: false,
          message: null
        },
        pageLoading: true
      }
    },
    beforeUpdate() {

      if (this.contactsItems) {
        this.fillContactsModel();
      }
    },
    watch: {
      form: function () {
        if (this.error.show) {
          this.error.show = false
        }
      }
    },
    methods: {
      onChange(errors) {

        if (this.error.show && !errors.items.length) {
          this.error.show = false
        }
      },
      fillContactsModel() {

        for( let item of this.contactsItems) {
          item.popover = false;
        }
      },
      togglePopover( curIndex ) {

        let cloneList = cloneDeep(this.contactsItems);

        for( let [index, item] of cloneList.entries()) {

          if (curIndex === index) {
            item.popover = !item.popover
          }else{
            item.popover = false;
          }
        }

        this.contactsItems = cloneList;
      },
      close() {
        this.$emit('toggleContactInfo')
      },
      getContacts() {

        this.$store.dispatch('getContactsInfo', {id: this.crewId})
          .then((res) => {
            this.contactsItems = res.items;
            this.pageLoading = false;

            this.fillContactsModel();
          })
          .catch((rej) => {
            this.renderError(rej);
          })
      },
      changeShowAs(index, item) {
        let data = null,
          val = !item.showAsContact;

        data = {
          email: item.email,
          phone: item.phone,
          name: item.name,
          showAsContact: val
        };

        this.$store.dispatch('changeContact', {id: this.crewId, contactId: item.id, data: data})
          .then(() => {
            item.showAsContact = val;
          })
          .catch((rej) => {
            item.showAsContact = !val;
            this.renderError(rej);
          })
      },
      createContact(e) {
        e.preventDefault();

        this.$validator.validateAll().then((result) => {
          this.submitted = true;

          if (result) {
            let data = this.form;

            this.isSending = true;
            this.error.show = false;

            data.showAsContact = false;
            data.phone = `+${data.phone}`;

            this.$store.dispatch('createContact', {id: this.crewId, data: data})
              .then((res) => {
                this.contactsItems.unshift(res);
                this.isSending = false;
                this.submitted = false;

                for (let key in this.form) {

                  if (this.form.hasOwnProperty(key)) {
                    this.form[key] = '';
                  }
                }
              })
              .catch((rej) => {
                this.isSending = false;
                this.$store.getters.formValidation(rej.data.body.form, this.errors);
                throw rej

              })
          } else {
            this.isSending = false;
          }
        });
      },
      deleteContact(index, contactId) {
        let curContact = this.contactsItems[index];

        this.contactsItems.splice(index, 1);

        this.$store.dispatch('deleteContact', {id: this.crewId, contactId: contactId})
          .then((res) => {})
          .catch((rej) => {
            this.contactsItems.splice(index, 0, curContact);
            this.renderError(rej);
          })
      },
      closeErrorAlert() {
        this.error.show = false;
      },
      renderError(rej) {
        let errorData = rej.data;
        this.error.show = true;

        if (errorData.error.message) {
          this.error.message = errorData.error.message;
        } else {
          this.error.message = errorData.error.description;
        }

        if (rej.status === 500) {
          return this.error.message = 'Server Error';
        }

        this.$store.getters.formValidation(errorData.body.form, this.errors)
      }
    },
    beforeMount: function () {
      this.getContacts();
    }
  }
</script>

<style lang="sass" scoped>
  @import '../../assets/scss/crew/crew-contacts'
</style>
