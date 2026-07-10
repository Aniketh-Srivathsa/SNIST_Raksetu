const PHONE_AUTH_EMAIL_DOMAIN = '@raksetu.app';

export function getPhoneRegistrationEmail(phone) {
  const phoneDigits = String(phone || '').replace(/\D/g, '');
  return phoneDigits ? `${phoneDigits}${PHONE_AUTH_EMAIL_DOMAIN}` : '';
}

export function isPhoneRegistration(user, userProfile = null) {
  const authEmail = user?.email || '';
  const profileEmail = userProfile?.email || '';
  const registrationType = userProfile?.registrationType;

  return (
    registrationType === 'phone' ||
    authEmail.endsWith(PHONE_AUTH_EMAIL_DOMAIN) ||
    profileEmail.endsWith(PHONE_AUTH_EMAIL_DOMAIN)
  );
}

export function canUseVerifiedFeatures(user, userProfile = null) {
  if (!user) {
    return false;
  }

  if (user.emailVerified) {
    return true;
  }

  return isPhoneRegistration(user, userProfile);
}

export function shouldShowEmailVerification(user, userProfile = null) {
  if (!user || user.emailVerified) {
    return false;
  }

  return !isPhoneRegistration(user, userProfile);
}

export function getFirebaseAuthErrorMessage(error) {
  if (!error) {
    return 'Authentication failed. Please try again.';
  }

  if (error.code === 'auth/unauthorized-domain') {
    return `This deployment URL is not authorized in Firebase Authentication. Add ${window.location.hostname} in Firebase Console > Authentication > Settings > Authorized domains, then try again.`;
  }

  if (error.code === 'auth/operation-not-allowed') {
    return 'This sign-in method is not enabled in Firebase Authentication.';
  }

  if (error.code === 'auth/popup-blocked') {
    return 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
  }

  if (error.code === 'auth/network-request-failed') {
    return 'Network error. Please check your connection and try again.';
  }

  return error.message || 'Authentication failed. Please try again.';
}
