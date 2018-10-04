
export default {
  isAdmin (user) {
    let isAdmin = false;

    for(let role of user.roles){

      if (role === 'ROLE_ADMIN') {
        isAdmin = true;
        break
      }
    }
    return isAdmin
  }
}
