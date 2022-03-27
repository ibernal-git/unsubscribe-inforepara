export default function isValidCaptcha (captchaToken: string): Promise<Boolean | Error> {
  const YOUR_PRIVATE_KEY = process.env.CAPTCHA_PRIVATE_KEY
  return fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${YOUR_PRIVATE_KEY}&response=${captchaToken}`, {
    method: 'POST',
    headers: new Headers({
      'Access-Control-Allow-Origin': '*'
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        return true
      } else {
        return false
      }
    })
    .catch((e) => {
      return new Error(e)
    })
}
