<template>

  <div class="chat">

    <div class="chat__messenger m-portlet m--margin-top-30"
         :class="{
           'scroll-to-top': scrollPosition < 2,
           'scroll-to-bottom': scrollPosition === 0
         }">

      <div class="chat__messenger-list"
           @scroll="handleScroll">

        <div class="chat__message chat__loading m-loader m-loader--center"
             v-if="isLoading">
        </div>

        <div class="chat__message"
             v-for="(item, index) in chatMessages"
             v-bind:key="index"
             :class="{'me': checkUser(item.userId)}">

          <div v-if="item && item.userName">
            <div class="chat__message-date" v-if="checkDate(index, item)">
              <span>{{dateFormat(item.createdAt)}}</span>
            </div>
            <div class="chat__message-inner">

              <div class="chat__message-head">

                <div class="chat__message-name m--font-bold">{{item.userName}}</div>

                <time class="chat__message-time">{{item.createdAt*1000 | date('HH:mm')}}</time>

              </div>

              <div class="chat__message-wrap"
                   :class="{'contain-file': item.type === 'file'}">
                <p v-if="item.body">
                  {{item.body}}
                </p>

                <div class="chat__message-file"
                     v-if="item.type === 'file'">

                  <div class="chat__message-file-info">

                    <div class="chat__message-file-type">

                    <span class="custom-icon"
                          :class="{
                             'file-img': getType(item.fileName) === 'image',
                             'file-pdf': getType(item.fileName) === 'pdf',
                             'file-default': getType(item.fileName) === 'file'
                           }"></span>

                    </div>

                    <div>

                      <p class="chat__message-file-name">{{item.fileName}}</p>
                      <span>{{formatBytes(item.fileSize)}}</span>

                    </div>

                  </div>

                  <span class="chat__message-download custom-icon download"
                        @click="downloadFile(item.fileLink, item.fileName)">
                </span>

                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

    </div>

    <form @submit="sendMessage" class="chat__composer">

      <fieldset>

        <label class="file-control" label-for="file">
          <b-form-file v-model="composer.file"
                       id="file"
                       plain
                       @change="checkFile">
          </b-form-file>
          <i class="la la-paperclip"></i>
        </label>

      </fieldset>

      <fieldset class="chat__composer-area">
        <b-form-input id="composer-text"
                      type="text"
                      v-model="composer.text"
                      autocomplete="off"
                      placeholder="Write a message...">
        </b-form-input>
      </fieldset>

      <fieldset>
        <button class="btn btn-sm btn-primary btn-loader"
                type="submit"
                v-bind:class="{'m-loader m-loader--light m-loader--center': isLoadMessage}"
                :disabled="!composer.text">
          Send
        </button>
      </fieldset>

      <div v-show="errorMessage"
           class="chat__error">
        {{errorMessage}}
      </div>

    </form>

  </div>

</template>

<script>
  import {mapState} from 'vuex';
  import {messagesWatch} from '~/plugins/setupFirebase'

  export default {
    name: "members-chat",
    computed: mapState([
      'chatMessages',
      'currentUser',
      'authToken',
      'unreadMessages'
    ]),
    props: [
      'groupId',
      'active'
    ],
    data() {

      return {
        messages: [],
        unreadRecords: 0,
        errorMessage: null,
        composer: {
          file: null,
          text: null
        },
        databaseRef: null,
        scroller: null,
        scrollPosition: 0,
        isLoading: true,
        isLoadMessage: false,
        lastDate: null,
        isActive: false,
        isSubscribe: false
      }
    },
    mounted() {

      this.getMessages();
      this.checkUser();
      this.scroller = document.querySelector('.chat__messenger-list');
    },
    watch: {
      active() {
        this.checkActiveTab()
      }
    },
    beforeUpdate() {
      this.checkActiveTab();
      this.setUnread();
    },
    beforeDestroy() {
      this.unsubscribeFirebaseData();

      this.scroller = null;
      this.readMessage('destroy');
      this.$store.dispatch('setMessages', {messages: []});
      this.$store.dispatch('setUnreadMessages', {unread: 0});
    },
    methods: {
      checkActiveTab() {

        if (this.active && !this.isActive) {
          this.isActive = true;
          this.scrollToBottom();
          this.readMessage()
        } else if (!this.active && this.isActive) {
          this.isActive = false;
          this.readMessage();
          this.$store.dispatch('setUnreadMessages', {unread: 0});
        }
      },
      downloadFile(file, fileName) {

        this.$store.dispatch('downloadFile', {url: file})
          .then((res) => {

            let blob = new Blob([res.data], {type: res.headers['content-type']});

            const link = document.createElement('a');

            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', fileName);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link)
          })
          .catch((rej) => {
            this.renderError(rej);
          })
      },
      subscribeFirebaseData() {
        this.databaseRef = messagesWatch(this.$route.params.groupId);

        let data;

        this.databaseRef.on('value', (dataSnapshot) => {
          data = dataSnapshot.val();

          this.matchMessages(data);
        });
      },
      unsubscribeFirebaseData() {

        if (this.databaseRef) {
          this.databaseRef.off();
        }
      },
      matchMessages(data) {
        let msgArr = [],
          newMsgArr = [];

        this.isSubscribe = true;

        for (let key in data) {

          if (data.hasOwnProperty(key)) {
            msgArr.push(data[key])
          }
        }

        if (msgArr.length>1) {
          for (let i = msgArr.length - 1; i > 0; i--) {

            let curObj = msgArr[i];

            if (this.isNewMessages(curObj, this.chatMessages)) {
              newMsgArr.unshift(curObj)
            }
          }
        } else if (msgArr.length === 1) {

          if (this.isNewMessages(msgArr[0], this.chatMessages)) {
            newMsgArr.unshift(msgArr[0])
          }
        }

        if (newMsgArr.length) {

          newMsgArr = this.chatMessages.concat(newMsgArr);
          this.$store.dispatch('setMessages', {messages: newMsgArr});

          this.isLoadMessage = false;

          setTimeout(() => {
            this.scrollToBottom()
          }, 200)
        }

      },
      isNewMessages(curObj, messages) {
        let isNew = true;

        for (let item of  messages) {

          if (item.id === curObj.id) {
            isNew = false;
            break
          }
        }
        return isNew;
      },
      checkDate(index, message) {
        let time = Math.floor((message.createdAt) / 86400) * 86400,
          prevTime = null;

        if (this.chatMessages[index - 1]) {
          prevTime = Math.floor((this.chatMessages[index - 1].createdAt) / 86400) * 86400
        }

        if (time !== prevTime) {
          return true
        }
      },
      dateFormat(date) {

        let dateObj = new Date(),
          messageTimeStamp = date * 1000,
          todayTimeStamp = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).valueOf(),
          dateOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          },
          dateStr = '';

        dateObj.setTime(messageTimeStamp);

        if (messageTimeStamp < todayTimeStamp - 86400000) {
          dateStr = dateObj.toLocaleString('en-US', dateOptions)
        } else if (messageTimeStamp < todayTimeStamp) {
          dateStr = 'Yesterday';
        } else {
          dateStr = 'Today';
        }

        return dateStr
      },
      getType(name) {
        let type = name.split('.').pop(),
          typeStr = null;

        switch (type) {
          case 'jpg':
            typeStr = 'image';
            break;
          case 'jpeg':
            typeStr = 'image';
            break;
          case 'png':
            typeStr = 'image';
            break;
          case 'pdf':
            typeStr = 'pdf';
            break;
          default:
            typeStr = 'file';
        }

        return typeStr
      },
      formatBytes(bytes, decimals) {
        if (bytes === 0) {
          return '0 Bytes'
        }

        let k = 1024,
          dm = decimals || 2,
          sizes = ['bytes', 'kb', 'mb', 'gb'],
          i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      },
      checkUser(curId) {
        let me = false;

        if (this.currentUser.id === curId) {
          me = true
        }

        return me
      },
      getMessages(time) {
        let request = null,
          scrollHeight = null,
          curTime;

        if (time) {
          request = 'getNewMessages';
          scrollHeight = this.scroller ? this.scroller.scrollHeight : 0;
        } else {
          request = 'getMessages';
          curTime = (new Date).getTime();
          time = curTime
        }

        this.$store.dispatch(request, {id: this.groupId, fromTime: time})
          .then((res) => {
            if (!res.recordsLeft) {
              this.isLoading = false
            }

            if (this.isActive) {
              this.readMessage()
            }

            this.unreadRecords = res.unreadRecordsLeft;

            if (time) {
              this.scrollToElem(scrollHeight);
            } else {
              this.scrollToBottom();
            }


            this.subscribeFirebaseData();
          })
          .catch((rej) => {
            this.renderError(rej);
          })
      },
      sendMessage(e) {
        e.preventDefault();
        const dataMsg = {
          body: this.composer.text
        };

        if (this.composer.text && !this.isLoadMessage) {

          this.isLoadMessage = true;
          this.composer.text = null;

          this.$store.dispatch('postMessage', {id: this.groupId, data: dataMsg})
            .then(() => {
              this.isLoadMessage = false;

              if (!this.isSubscribe) {
                this.subscribeFirebaseData();
              }
              this.readMessage()
            })
            .catch((rej) => {
              this.composer.text = dataMsg.body;
              this.renderError(rej);
            })
        }
      },
      checkFile() {
        this.isLoadMessage = true;

        setTimeout(() => {
          if (this.composer.file) {
            this.sendFile()
          } else {
            this.checkFile()
          }
        }, 50);
      },
      getNewMessages() {

        if (this.isLoading && this.chatMessages && this.chatMessages[0].createdAt) {
          let timestamp = this.chatMessages[0].createdAt;
          this.getMessages(timestamp);
        }
      },
      sendFile() {

        let file = this.composer.file,
          formData = new FormData();

        formData.append('file', file);

        this.$store.dispatch('postMessageFile', {id: this.groupId, file: formData})
          .then((res) => {
            this.composer.file = null;
            this.isLoadMessage = false;
            this.readMessage();
            this.scrollToBottom();
          })
          .catch((rej) => {
            this.renderError(rej);
          })
      },
      handleScroll(e) {
        let elem = e.srcElement,
          sum = elem.scrollTop + elem.offsetHeight;

        if (elem.scrollTop > 0 && !(sum >= elem.scrollHeight)) {
          this.scrollPosition = 1
        } else if (elem.scrollTop === 0) {
          this.scrollPosition = 0;
          this.getNewMessages();
        } else {
          this.scrollPosition = 2
        }
      },
      scrollToBottom() {

        if (!this.scroller) {
          this.scroller = document.querySelector('.chat__messenger-list');
        }

        if (this.scroller) {
          this.scroller.scrollTop = this.scroller.scrollHeight + 100;
          this.scrollPosition = 2;
        }
      },
      scrollToElem(scrollHeight) {

        if (this.scroller) {
          this.scroller.scrollTop = this.scroller.scrollHeight - scrollHeight;
        }
      },
      renderError(rej) {
        let errorData = rej;

        this.isLoadMessage = false;

        if (errorData.body && errorData.body.errors && errorData.body.errors[0]) {
          this.errorMessage = errorData.body.errors[0];
        }else if (errorData.error.message) {
          this.errorMessage = errorData.error.message;
        }else{
          this.errorMessage = errorData.error.description;
        }

        if (rej.code === 500) {
          this.errorMessage = 'Server Error';
        }

        setTimeout(() => {
          this.errorMessage = null;
        }, 5000)
      },
      readMessage( destroy ) {

        this.$store.dispatch('readMessages', {id: this.groupId})
          .then(() => {

            if (!destroy) {
              for ( let message of this.chatMessages) {

                if (!message.readByUsers) {
                  message['readByUsers'] = [];
                }

                if ( !this.checkCurrentId(message.readByUsers) ) {
                  message.readByUsers.push({
                    userId: this.currentUser.id,
                    userName: this.currentUser.username
                  })
                }
              }

              this.unreadRecords = 0;
              this.$store.dispatch('setMessages', {messages: this.chatMessages});

              this.setUnread();
            }
          })
          .catch((rej) => {
            this.renderError(rej);
          })
      },
      checkCurrentId(readByUsers) {
        let read = false;

        if (readByUsers) {

          for (let user of readByUsers) {

            if (user.userId === this.currentUser.id) {
              read = true
            }
          }
        }

        return read
      },
      checkUnread() {
        let count = 0;

        for (let message of this.chatMessages) {

          let readByUsers = message.readByUsers;

          if ( message.userId && !this.checkCurrentId(readByUsers) ) {
            count++
          }

        }
        count = this.unreadRecords + count;

        return count
      },
      setUnread() {

        if (!this.active) {
          this.$store.dispatch('setUnreadMessages', {unread: this.checkUnread()});
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/crew/crew-chat.scss';
</style>
