const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

let scriptLoaded = false;
let scriptPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function getRecaptchaToken(action: string): Promise<string> {
  if (!SITE_KEY) {
    throw new Error('reCAPTCHA site key is not configured');
  }

  await loadRecaptchaScript();

  if (!window.grecaptcha) {
    throw new Error('reCAPTCHA failed to initialize');
  }

  return new Promise<string>((resolve, reject) => {
    window.grecaptcha!.ready(() => {
      window.grecaptcha!
        .execute(SITE_KEY, { action })
        .then(resolve)
        .catch(reject);
    });
  });
}
