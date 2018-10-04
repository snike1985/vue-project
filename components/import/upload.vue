<template>

  <!--import__dropzone-->
  <div class="import__dropzone">

    <!--import__dropzone-wrap-->
    <div class="import__dropzone-wrap"
         :class="{'drag': dragIsEnter}">

      <!--import__dropzone-icon-->
      <div v-if="!upload.error" class="import__dropzone-icon">

        <img v-if="!upload.selected" width="101" src="~/assets/images/import-icon.png"
             alt="import-icon">
        <img v-if="upload.selected" width="98" src="~/assets/images/import-selected-icon.png"
             alt="import-icon">

      </div>
      <!--/import__dropzone-icon-->

      <!--import__dropzone-error-->
      <div v-if="upload.error" class="import__dropzone-icon import__dropzone-error">
        <img width="63" src="~/assets/images/import-icon-error.png" alt="import-icon">
        <p>Failure to upload file</p>
      </div>
      <!--/import__dropzone-error-->

      <!--import__dropzone-uploaded-->
      <div v-if="isUpload && !upload.error" class="import__dropzone-uploaded">

        <p>Uploaded file ...</p>

        <!--import__dropzone-spinner-->
        <div class="import__dropzone-spinner m-loader m-loader--center"></div>
        <!--/import__dropzone-spinner-->

        <button class="import__dropzone-cancel"
                type="button"
                @click="cancelUpload">
          Cancel uploading
        </button>

      </div>
      <!--/import__dropzone-uploaded-->

      <div v-if="!isUpload || upload.error">

        <!--import__dropzone-title-->
        <h3 class="import__dropzone-title">
          <span v-if="!upload.selected && !upload.uploaded">Drag & drop file to upload</span>
          <span v-if="upload.selected">File selected</span>
          <span v-if="upload.uploaded">File uploaded</span>
        </h3>
        <!--/import__dropzone-title-->

        <!--import__dropzone-subtitle-->
        <div class="import__dropzone-subtitle"
             :class="{'error': upload.errorMsg}">

                        <span v-if="!upload.selected && !upload.uploaded && !upload.errorMsg || upload.serverErrMsg">
                          or
                         <label class="select m-link m-link--state m-link--info m--font-boldest2" label-for="file">
                          <b-form-file v-model="upload.file"
                                       id="file"
                                       plain
                                       accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv"
                                       @change="selectFile">
                          </b-form-file>
                           Select
                        </label>

                        </span>

          <span v-if="upload.selected || upload.uploaded">

                          {{upload.fileName}}

                          <button type="button"
                                  class="delete btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"
                                  @click="deleteFile()">
                            <i class="la la-close"></i>
                          </button>

                        </span>

        </div>
        <!--/import__dropzone-subtitle-->

        <!--import__dropzone-btns-->
        <div class="import__dropzone-btns">

          <button v-if="!upload.uploaded"
                  type="button"
                  class="btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-info"
                  :disabled="upload.errorMsg || !upload.file"
                  @click="loadFile()">
            Proceed
          </button>

          <button v-if="upload.uploaded"
                  type="button"
                  class="btn m-btn m--font-transform-u m-btn--wide m--font-boldest2 btn-info"
                  @click="step(1)">
            Proceed
          </button>

        </div>
        <!--/import__dropzone-btns-->

        <!--import__dropzone-note-->
        <p v-if="!upload.selected && !upload.uploaded" class="import__dropzone-note">
          Only .csv .xls .xlsx file types are supported.
          <span v-if="upload.errorMsg">{{upload.errorMsg}}</span>
        </p>
        <!--/import__dropzone-note-->

        <!--import__dropzone-note-->
        <p v-if="upload.errorMsg || upload.serverErrMsg" class="import__dropzone-note error">
          {{upload.errorMsg || upload.serverErrMsg}}
        </p>
        <!--/import__dropzone-note-->
      </div>

    </div>
    <!--/import__dropzone-wrap-->

    <dropzone id="dropZone"
              class="import__dropzone-area"
              ref="dropzone"
              :options="options"
              :destroyDropzone="true"
              :include-styling="false"
              @vdropzone-drag-enter="dragEnter"
              @vdropzone-file-added="fileAdded"
              @vdropzone-file-added-manually="afterComplete"
              @vdropzone-error="vdropzoneError"
              @vdropzone-complete="afterComplete">
    </dropzone>

  </div>
  <!--/import__dropzone-->

</template>

<script>
  import Dropzone from 'nuxt-dropzone'

  export default {
    components: {Dropzone},
    props: ['id', 'step', 'matchingData'],
    created: function () {},
    beforeUpdate() {},
    beforeDestroy() {},
    data() {
      return {
        data: this.matchingData,
        options: {
          url: 'https://httpbin.org/post',
          clickable: false,
          acceptedFiles: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv',
          maxFilesize: 5,
          maxFiles: 1,
          previewTemplate: this.dropZoneTemplate(),
        },
        upload: {
          file: null,
          fileName: '',
          error: false,
          errorMsg: '',
          serverErrMsg: '',
          selected: false,
          uploaded: false
        },
        dragIsEnter: false,
        isUpload: false,
        isCancel: false,
        curStep: this.step
      }
    },
    methods: {
      dropZoneTemplate() {
        return `<div style="display: none"></div>`;
      },
      afterComplete(file) {

        this.upload.file = file;
        this.upload.selected = true;
        this.upload.fileName = file.name;
      },
      fileAdded() {
        this.upload.error = false;
        this.upload.serverErrMsg = '';
        this.dragIsEnter = false
      },
      dragEnter() {
        this.dragIsEnter = true
      },
      deleteFile() {
        this.$refs.dropzone.removeAllFiles();
        this.resetUploadModel()
      },
      resetUploadModel() {
        this.upload.file = null;
        this.upload.selected = false;
        this.upload.uploaded = false;
        this.upload.fileName = '';
        this.upload.errorMsg = '';
        this.isUpload = false;
      },
      vdropzoneError(file, message, xhr) {
        this.upload.errorMsg = message;
      },
      cancelUpload() {
        this.$refs.dropzone.removeAllFiles(true);
        this.$store.dispatch('setMatchingData', {data: null});
        this.resetUploadModel();
        this.isCancel = true;
      },
      loadFile() {
        const formData = new FormData();

        this.isUpload = true;

        formData.append('file', this.upload.file);

        this.$store.dispatch('importFile', {id: this.id, file: formData})
          .then((res) => {

            if (res && !this.isCancel) {
              this.isUpload = false;
              this.upload.selected = false;
              this.upload.uploaded = true;
            }
            this.isCancel = false;
          })
          .catch((rej) => {

            if (!this.isCancel) {
              this.cancelUpload();

              this.upload.serverErrMsg = rej.body.errors[0];
              this.upload.error = true;
            }
            this.isCancel = false;
          });
      },
      selectFile() {

        setTimeout(() => {
          if (this.upload.file) {

            this.$refs.dropzone.manuallyAddFile(this.upload.file);

          } else {

            this.selectFile()
          }
        }, 50);
      },
    },
    name: 'upload'
  }
</script>
