import firebase from '~/services/firebase-init'
import 'firebase/database';

export function messagesWatch (groupId) {
  return firebase.database().ref('/chat/' + groupId + '/messages')
}
export function alertsWatch (id) {
  return firebase.database().ref('/notification/manager/' + id)
}
