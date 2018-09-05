const request = require('request')
const cheerio = require('cheerio')
const sanitizeHTML = require('sanitize-html')
const google = require('google')
const iconv  = require('iconv-lite')
const charset = require('charset')


exports.getTemp = (req, res) => {
  const _place = req.body.place

  const _url = 'http://www.nifs.go.kr/risa/main.risa#'

  request(_url ,(err, _, html) => {
    if (err) {
      throw err
    }
    let $ = cheerio.load(html)

    $('.list').each(function(){
      let dirty = sanitizeHTML($(this).toString(), {
        allowedTags: ['div', 'a']
      })
      let a = dirty.replace(/(<([^>]+)>)/ig,"")
      let clean = a.replace(/\s/gi, "")
      if (clean.indexOf(_place) !== -1) {
        let i = clean.indexOf(_place) + _place.length
        if (clean.substring(i, i+3) === '점검중') {
          return res.send('checking')
        }
        while (clean.substring(i, i+1) !== '℃') {
          i = i + 1
        }
        res.json({ result: clean.substring(clean.indexOf(_place)+_place.length, i+1) })
      } else {
        res.send('not found')
      }
      //res.send($(this).indexOf(place))
      //res.send(clean)
    })
  })
}

exports.parser = (req, res) => {
  const _place = req.body.place + ' 기상청'
  
  google.resultsPerPage = 1

  function searchGoogle () {
    return new Promise((resolve, reject) => {
      google(_place, function (err, res){
        if (err) throw(err)
      
        if (res.links[0] === "") {
          reject('no result')
        }
        resolve(res.links[0].link)
      })
    })
  }

  function getBody (resolvedData) {
    return new Promise((resolve) => {

      request({
        uri: resolvedData,
        encoding: null
      }, (err, _, body) => {
        if (err) {
          throw err
        }

        const enc = charset(res.headers, body)
			  const i_result = iconv.decode(body, enc)
			  resolve(i_result)
      })
    })
  }
 
  searchGoogle().then((resolvedData) => {
    getBody(resolvedData).then((resolvedData) => {
      let where = resolvedData.indexOf('<body>')
      let rawData = resolvedData.substring(where, resolvedData.length)
      const $ = cheerio.load(rawData)
      const data = {
        when: $('p .date', $('#serviceList321')).text(),
        where: $('.svcmain tbody tr .thtype2', $('#serviceList321')).text(),
        whether: $('.svcmain tbody tr td div.bx_wth4 div.icon strong', $('#serviceList321')).text(),
        temp: $('.svcmain tbody tr td div.bx_wth4 dl.txt dd.long', $('#serviceList321')).first().text(),
        hum: $('.svcmain tbody tr td div.bx_wth4 dl.txt dd.long', $('#serviceList321')).eq(1).text(),
        percent: $('.svcmain tbody tr td', $('#serviceList303')).first().text(),
        rain: $('.svcmain tbody > tr:nth-of-type(2) td', $('#serviceList303')).first().text(),
        water_temp: $('table tbody tr > td:nth-of-type(1) table.svcmain tbody tr td', $('#serviceList115')).text().substring(0, $('table tbody tr > td:nth-of-type(1) table.svcmain tbody tr td', $('#serviceList115')).text().indexOf('℃')+1),
        height_of_waves: $('table tbody tr > td:nth-of-type(1) table.svcmain tbody tr td', $('#serviceList115')).text().substring($('table tbody tr > td:nth-of-type(1) table.svcmain tbody tr td', $('#serviceList115')).text().indexOf('/')+1, $('table tbody tr > td:nth-of-type(1) table.svcmain tbody tr td', $('#serviceList115')).text().length),
        sunrise: $('table tbody tr > td:nth-of-type(3) table.svcmain tbody > tr:nth-of-type(1) > td:nth-of-type(1)', $('#serviceList115')).text(),
        sunset: $('table tbody tr > td:nth-of-type(3) table.svcmain tbody > tr:nth-of-type(1) > td:nth-of-type(2)', $('#serviceList115')).text(),
        rising_tide: [$('table tbody tr > td:nth-of-type(5) table.svcmain tbody > tr:nth-of-type(1) > td:nth-of-type(2)', $('#serviceList115')).text(), $('table tbody tr > td:nth-of-type(5) table.svcmain tbody > tr:nth-of-type(1) > td:nth-of-type(4)', $('#serviceList115')).text()],
        ebb_tide: [$('table tbody tr > td:nth-of-type(5) table.svcmain tbody > tr:nth-of-type(1) > td:nth-of-type(1)', $('#serviceList115')).text(), $('table tbody tr > td:nth-of-type(5) table.svcmain tbody > tr:nth-of-type(1) > td:nth-of-type(3)', $('#serviceList115')).text()]
      }
      res.send(data)
    })
  })
}