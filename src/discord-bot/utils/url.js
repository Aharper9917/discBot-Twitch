// var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//   '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//   '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//   '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//   '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//   '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
// return !!pattern.test(str);

const isValidUrl = (str, checkTwitch = false) => {
  try {
    url = new URL(str);

    if (checkTwitch) return (url.host === 'www.twitch.tv' || url.host === 'twitch.tv')    
    return true
  } catch (_) {
    return false;  
  }
}

const isValidTwitchUrl = (str) => {
  return isValidUrl(str, true)
}

const getTwitchUsernameFromUrl = (str) => {
  try {
    if (!isValidTwitchUrl(str)) throw new Error('Not a valid Twitch URL')
    url = new URL(str);

    return url.pathname.split('/')[1]
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  isValidUrl,
  isValidTwitchUrl,
  getTwitchUsernameFromUrl
}