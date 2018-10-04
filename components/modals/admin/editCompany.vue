<template>
  <b-modal
    v-model="editCompanyModal.open"
    id="editCompany"
    size="sm"
    :class="'medium-dialog'"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true">
    <span class="m--font-grey close-modal-btn" @click="toggleModal">
      <i class="la la-close"></i>
    </span>

    <h4 class="m--font-blue m-form m--margin-top-10 text-center">
      Edit Company
    </h4>

    <b-form class="m-form m--margin-top-20" novalidate>
      <b-form-group class="m-form__group"
                    :class="{'has-danger': errors.has('name') && form.submitted}"
                    label="Name:"
                    label-for="name">
        <b-form-input id="name"
                      type="text"
                      v-model="form.fields.name"
                      v-validate="'required|min:1|max:140'"
                      required
                      data-vv-as="Name"
                      name="name"
                      minlength="1"
                      maxlength="140"
                      placeholder="John Doue"
                      class="m-input">
        </b-form-input>
        <div v-show="form.submitted && errors.has('name')" class="form-control-feedback">
          {{errors.first('name')}}
        </div>
      </b-form-group>
      <div class="row m--margin-bottom-15">
        <div class="col-md-6">
          <b-form-group label="Payment Plan:"
                        class="m-form__group"
                        :class="{'has-danger': errors.has('type') && form.submitted}"
                        label-for="paymentTypes">
            <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100"
                        id="paymentTypes"
                        :text="paymentTypes.selected">
              <b-dropdown-item v-for="option in paymentTypes.options"
                               v-bind:key="option.val"
                               v-on:click="changeSelectVal(option.val, 'type', paymentTypes)">
                {{option.label}}
              </b-dropdown-item>
            </b-dropdown>
            <div v-show="form.submitted && errors.has('type')" class="form-control-feedback">
              {{errors.first('type')}}
            </div>
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="Payment Plan:"
                        class="m-form__group"
                        :class="{'has-danger': errors.has('period') && form.submitted}"
                        label-for="paymentTypes">
            <b-dropdown class="bootstrap-select m-bootstrap-select m_ w-100"
                        id="paymentTypes"
                        :text="paymentPeriods.selected || 'Select'">
              <b-dropdown-item v-for="option in paymentPeriods.options"
                               v-bind:key="option.value"
                               v-on:click="changeSelectVal(option.val, 'period', paymentPeriods)">
                {{option.label}}
              </b-dropdown-item>
            </b-dropdown>
            <div v-show="form.submitted && errors.has('period')" class="form-control-feedback">
              {{errors.first('period')}}
            </div>
          </b-form-group>

        </div>
      </div>

      <b-form-group class="m-form__group"
                    v-if="form.fields.payment.type === 'custom'"
                    :class="{'has-danger': errors.has('memberLimit') && form.submitted}"
                    label="Number of Crew Members per month:"
                    label-for="memberLimit">
        <b-form-input id="memberLimit"
                      type="number"
                      v-model="form.fields.payment.memberLimit"
                      v-validate="'required|max:6'"
                      required
                      data-vv-as="Member Limit"
                      name="memberLimit"
                      placeholder="Number of Crew Members per month"
                      class="m-input">
        </b-form-input>
        <div v-show="form.submitted && errors.has('memberLimit')" class="form-control-feedback">
          {{errors.first('memberLimit')}}
        </div>
      </b-form-group>

      <b-form-group class="date-input m-form__group"
                    :class="{'has-danger': errors.has('validTill') && form.submitted}"
                    label="Next Billing Date:"
                    label-for="validTill">
        <input type='text'
               class="form-control billing-date"
               id="validTill"
               readonly
               name="name"
               placeholder="dd.mm.yyyy"/>

        <div v-show="form.submitted && errors.has('validTill')" class="form-control-feedback">
          {{errors.first('validTill')}}
        </div>
      </b-form-group>

      <b-form-group class="date-input m-form__group"
                    :class="{'has-danger': errors.has('active') && form.submitted}">
        <b-form-checkbox class="m-checkbox"
                         v-model="form.fields.payment.active"
        >
          Plan Currently Active
          <span></span>
        </b-form-checkbox>
      </b-form-group>

      <div v-if="form.error" class="text-center">
        <span class="m--font-danger m--font-boldest">{{form.error}}</span>
      </div>

      <div class="row">
        <div class="col-md-6">
          <button
            @click="editCompany"
            class=" m--margin-top-15 w-100 btn m-btn m--font-transform-u m--font-boldest2 btn-info"
            v-bind:class="{'m-loader m-loader--light m-loader--right': form.loading}"
            type="submit">
            save
          </button>
        </div>
        <div class="col-md-6">
          <button
            @click="toggleModal"
            class=" m--margin-top-15 w-100 btn m-btn m--font-transform-u m--font-boldest2 btn-dark"
            type="button">
            cancel
          </button>
        </div>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
  import { mapState } from 'vuex'
  import findIndex from 'lodash/findIndex'
  import cloneDeep from 'lodash/cloneDeep'
  import moment from 'moment-timezone'

  export default {
    name: 'edit-company',
    props: ['company'],
    computed: mapState([
      'editCompanyModal'
    ]),
    data () {
      const company = cloneDeep(this.company)
      return {
        paymentTypes: {
          selected: 'Select',
          options: [
            {id: 1, val: 'standard', label: 'Standard'},
            {id: 2, val: 'premium', label: 'Premium'},
            {id: 3, val: 'custom', label: 'Custom'}
          ]
        },
        paymentPeriods: {
          selected: 'Select',
          options: [
            {val: 'annual', label: 'Annual'},
            {val: 'quarter', label: 'Quarter'}
          ]
        },
        form: {
          fields: {
            name: company.name,
            payment: {
              type: null,
              period: null,
              memberLimit: company.paymentMemberLimit,
              price: 0,
              validTill: this.company.paymentValidTill,
              active: company.paymentActive
            }
          },
          error: null,
          submitted: false
        }
      }
    },
    methods: {
      editCompany (evt) {
        evt.preventDefault()


        this.$validator.validateAll().then((result) => {
          this.form = {
            ...this.form,
            submitted: true,
            error: null
          }
          if (result) {
            this.form = {
              ...this.form,
              loading: true
            }

            this.$store.dispatch('editCompany', {form: this.form.fields, id: this.company.id})
              .then(() => {
                this.$store.dispatch('getCompanyList')
                  .then(() => {
                    this.toggleModal()
                  })
              })
              .catch((err) => {
                if (err.error.code === 500) {
                  this.form.error = 'Server error'
                }
                this.$store.getters.formValidation(err.body.form, this.errors)

                if(err.body.form.children.payment) {
                  this.$store.getters.formValidation(err.body.form.children.payment, this.errors)
                }

              })
              .finally(() => {
                this.form = {
                  ...this.form,
                  loading: false
                }
              })
          }
        })
      },
      toggleModal () {
        const data = {
          open: false
        }
        this.$store.commit('SET_EDIT_COMPANY_MODAL', data)
      },
      changeSelectVal (val, name, select) {
        const index = findIndex(select.options, {val})
        if (index < 0) return
        select.selected = select.options[index].label
        this.form.fields.payment[name] = select.options[index].val
        this.errors.remove(name)
      },
      setDate (val) {
        const formatedVal = moment(val).utc().format('X')
        this.form.fields.payment.validTill = formatedVal
        this.errors.remove('validTill')
      }
    },
    mounted: function () {

      const dateEl = $('#validTill')
      dateEl.datepicker({
        todayHighlight: true,
        templates: {
          leftArrow: '<i class="la la-angle-left"></i>',
          rightArrow: '<i class="la la-angle-right"></i>'
        },
        format: 'dd.mm.yyyy'
      })

      const updateDate = (ev) => {
        dateEl.datepicker('hide')
        this.setDate(ev.date)
      }

      dateEl.on('changeDate.daterangepicker', updateDate)

      const setInitialVal = () => {
        this.changeSelectVal(this.company.paymentType, 'type', this.paymentTypes)
        this.changeSelectVal(this.company.paymentPeriod, 'period', this.paymentPeriods)

        if (this.company.paymentValidTill) {
          dateEl.datepicker('setDate', moment(this.company.paymentValidTill * 1000).format('DD.MM.YYYY'))
        }
      }

      setInitialVal()
    }
  }
</script>
