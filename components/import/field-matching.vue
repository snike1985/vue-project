<template>

  <!--import__matching-->
  <div class="import__matching">

    <!--import__matching-checkboxes-->
    <div class="import__matching-checkboxes">

      <b-form-group class="m-form__group">

        <b-form-checkbox v-model="columnNames"
                         id="accepted"
                         class="m-checkbox"
                         :value="true"
                         :unchecked-value="false">

          First Line is Column Names
          <span></span>
        </b-form-checkbox>

      </b-form-group>

    </div>
    <!--/import__matching-checkboxes-->

    <!--import__matching-wrap-->
    <div class="import__matching-wrap" role="tablist">

      <!--import__matching-head-->
      <div class="import__matching-head row">

        <div class="col-md-6"><div class="import__matching-column-title">Jurnez</div></div>
        <div class="col-md-6"><div class="import__matching-column-title">Imported File</div></div>

      </div>
      <!--/import__matching-head-->

      <div class="row import__matching-inner">

        <div class="col-md-6">

          <div v-for="(item, index) in importedModel"
               :key="index"
               class="m--margin-bottom-10">

            <b-card v-if="modelInterfaces[index]"
                    no-body
                    :class="{
                        'import__matching-item current': true,
                        'error': checkRequired(modelInterfaces[index]) && isError,
                        'required': checkRequired(modelInterfaces[index])
                      }">

              <b-card-header header-tag="header"
                             class="import__matching-item-head"
                             role="tab">

                <b-btn block><span>{{setName(modelInterfaces[index])}}</span></b-btn>

              </b-card-header>

              <b-collapse v-if="!isEmpty(importedModel[index])" :id="'accordion_'+index+''" accordion="accordion" role="tabpanel">

                <b-card-body>
                  <ul class="import__matching-item-list hidden">
                    <li v-for="(str, index) in item.exampleData"
                        :key="'row_'+index+''">{{str}}</li>
                  </ul>
                </b-card-body>

              </b-collapse>

            </b-card>

          </div>

        </div>

        <draggable v-model="importedModel" :options="{draggable:'.item'}" class="col-md-6">

          <div v-for="(item, index) in importedModel"
               :class="{'hidden': isEmpty(item)}"
               :key="index"
               class="item m--margin-bottom-10">

            <b-card no-body class="import__matching-item imported">

              <b-card-header header-tag="header"
                             class="import__matching-item-head"
                             role="tab">

                <b-btn block href="#" v-b-toggle="'accordion_'+index+''">

                  <i class="la la-angle-down"></i>

                  {{setColumnName(item, index)}}

                  <i class="la la-reorder"></i>

                  <i v-if="checkLength()"
                     @click="deleteColumn(item, index)"
                     class="la la-close"></i>

                </b-btn>

              </b-card-header>

              <b-collapse v-if="!isEmpty(item)"
                          :id="'accordion_'+index+''"
                          accordion="accordion"
                          role="tabpanel">

                <b-card-body>
                  <ul class="import__matching-item-list">
                    <li v-for="(str, index) in item.exampleData"
                        :key="'row_'+index+''">{{str}}</li>
                  </ul>
                </b-card-body>

              </b-collapse>

            </b-card>

          </div>

        </draggable>

        <div class="import__loading m-loader m-loader--center m-loader--info"
             v-if="isImported">
        </div>

      </div>

      <!--import__matching-btns-->
      <div class="import__matching-btns m--margin-top-40">

        <button type="button"
                class="btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-info"
                :disabled="checkLength() || isFinished || isError"
                @click="finishedImport()">
          Finish
        </button>

        <p v-if="isFinished" class="m--margin-top-20">
          We are importing the file and it can take a while. Once finished please go to
          <nuxt-link class="m-link m-link--state m-link--info m--font-boldest2"
                     :to="('/manage-crew-changes/' + id + '')">
            Crew Change
          </nuxt-link>
        </p>

        <p v-if="isError" class="m--margin-top-20 import__error">
          Please go <span @click="goBack" class="m-link m-link--state m-link--info m--font-boldest2">back</span> to start import again and make sure to match required fields
        </p>

      </div>
      <!--/import__matching-btns-->

    </div>
    <!--/import__matching-column-->

  </div>
  <!--/import__matching-->

</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    components: {draggable},
    props: ['id', 'step', 'matchingObj'],
    created() {},
    beforeUpdate() {},
    beforeDestroy() {},
    mounted() {
      this.setModel()
    },
    data() {

      return {
        data: this.matchingObj,
        columnNames: true,
        showCollapse: true,
        modelInterfaces: this.matchingObj.fieldsForImport,
        importedModel: this.matchingObj.matchingData,
        isFinished: false,
        isImported: false,
        isError: false,
        requiredFields: this.matchingObj.requiredFieldsForImport
      }
    },
    methods: {
      goBack() {
        this.step(0)
      },
      setName(item) {
        let name = '';

        name = item.replace(/([a-z])([A-Z])/g, '$1 $2');
        name = name.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

        return name
      },
      setColumnName(item, index) {
        let name = '';

        if (!this.modelInterfaces[index] && !this.columnNames) {

          name = `Column ${index+1}`

        } else if (this.columnNames) {

          name = item.columnName
        } else {

          name = this.modelInterfaces[index]
        }
        return name
      },
      isEmpty( item ) {

        for (let i in item) {

          if (item.hasOwnProperty(i) && Object.keys(item).length > 1) {
            return false;
          }
        }

        return true
      },
      setModel() {

        const importedLength = this.importedModel.length,
         interfacesLength = this.modelInterfaces.length;

        if (importedLength < interfacesLength) {

          const differences = interfacesLength - importedLength;

          for ( let i=0; i<differences; i++ ) {
            this.importedModel.push({})
          }
        }
      },
      checkRequired(item) {
        let required = null;

        for (name of this.requiredFields){

          if (name === item) {
            required = true;
            break
          }
        }

        return required
      },
      checkLength() {
        return this.importedModel.length < this.modelInterfaces.length
      },
      deleteColumn(item, index) {

        this.importedModel.splice(index, 1);
      },
      finishedImport() {

        let data = null;

        for( let [index, item] of this.importedModel.entries()) {
          item.field = this.modelInterfaces[index]
        }

        data = {matchingData: this.importedModel};

        this.$store.dispatch('importExecute', {id: this.id, importId: this.matchingObj.id, data: data})
          .then((res) => {
            this.isFinished = true;
            this.isImported = true;

            this.checkImportStatus();
          })
          .catch((rej) => {});
      },
      getCrewList() {

        this.$store.dispatch('getCrewGroupList', this.id)
          .then((res) => {
            this.isImported = false;

            setTimeout(()=>{
              this.$router.push('/manage-crew-changes/' + this.id + '');
            },1500);
          })
          .catch((rej) => {});
      },
      checkImportStatus() {

        this.$store.dispatch('getImportStatus', {id: this.id, importId: this.matchingObj.id})
          .then((res) => {
            const status = res.status;

            if (status === 'finished') {
              this.getCrewList()
            } else if (status === 'failed') {
              this.isImported = false;
              this.isFinished = false;
              this.isError = true;
            } else {
              setTimeout(()=>{
                this.checkImportStatus()
              },5000)
            }
          })
          .catch((rej) => {});
      }
    },
    name: 'file-matching'
  }
</script>
