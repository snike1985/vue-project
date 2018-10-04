import Cookies from 'cookies'
import VueCookie from 'vue-cookie'

export default function ({app, route, redirect, store, req, res, from}) {
  let auth_token,
    routeName = route.name,
    currentUser = store.state.currentUser,
    isEmailVerified = currentUser ? currentUser.emailVerified : null,
    payment = store.state.payment,
    notifications = store.state.alertsList;

  let isTermsPrivacyPages = () => {
      let pages = true;

      if (routeName !== 'terms' && routeName !== 'privacy') {
        pages = false
      }
      return pages;
    },
    loginGuard = () => {
      let redirect = false;

      if (!auth_token && !isTermsPrivacyPages() && routeName !== 'login') {
        redirect = true
      }
      return redirect;
    },
    blockedUser = () => {
      let redirect = false;

      if (currentUser && !currentUser.active && !isTermsPrivacyPages() && routeName !== 'settings') {
        redirect = true
      }
      return redirect;
    },
    notPaymentUser = () => {
      let redirect = false;

      if (currentUser && isEmailVerified && !payment && !isTermsPrivacyPages()) {
        redirect = true
      }
      return redirect;
    },
    notAcceptedTerms = () => {
      let redirect = false;

      if (currentUser && isEmailVerified && !currentUser.acceptTerms && !isTermsPrivacyPages()) {
        redirect = true
      }
      return redirect;
    },
    notAcceptedPrivacy = () => {
      let redirect = false;

      if (currentUser && isEmailVerified && !currentUser.acceptPrivacy && !isTermsPrivacyPages()) {
        redirect = true
      }
      return redirect;
    };

  if (process.server) {
    const cookies = new Cookies(req, res);
    auth_token = cookies.get('auth_token')
  } else {
    auth_token = VueCookie.get('auth_token')
  }
  if (loginGuard()) {
    return redirect('/login')
  }

  if (currentUser && !isEmailVerified && routeName !== 'login') {
    return redirect('/login/email-verification')
  }

  if (blockedUser() && routeName !== 'blocked') {
    return redirect('/blocked')
  } else if (!blockedUser() && routeName === 'blocked') {
    return redirect('/manage-crew-changes')
  }

  if (notAcceptedTerms() && routeName !== 'terms') {
    return redirect('/terms')
  }

  if (notAcceptedPrivacy() && routeName !== 'privacy') {
    return redirect('/privacy')
  }

  if (notPaymentUser() && routeName !== 'payment') {
    return redirect('/payment')
  }

  if (auth_token) {
    store.commit('SET_AUTH_TOKEN', auth_token);
    const fromPath = from && from.path;
    const toPath = route && route.path;

    if (fromPath !== '/notifications') {
      store.commit('RESET_ALERTS_LIST');
    }

    if(fromPath !== toPath && routeName !== 'notifications' && routeName !== 'index') {

      store.dispatch('getAlertsList');

      if(!store.state.superAdmin) {
        store.dispatch('loginFirebaseUser');
      }
    }
  }
}
