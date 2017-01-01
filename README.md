# Geartrack

[![NPM](https://nodei.co/npm/geartrack.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/geartrack/)

[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://travis-ci.org/iamfreee/geartrack)
[![David](https://img.shields.io/david/iamfreee/geartrack.svg)]()
[![Known Vulnerabilities](https://snyk.io/test/github/iamfreee/geartrack/badge.svg)](https://snyk.io/test/github/iamfreee/geartrack)
[![GitHub release](https://img.shields.io/github/tag/iamfreee/geartrack.svg)]()
[![license](https://img.shields.io/github/license/iamfreee/geartrack.svg)]()
[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://geartrack.hdn.pt/)

## Track shippments from Gearbest with the Spain Priority Line method
Online version: [https://geartrack.hdn.pt](https://geartrack.hdn.pt)

### Parcel Flow
Your parcel should come from China (multiple countries envolved here) -> Spain -> Portugal, with this app you can track exactly where your parcel is.

This litle script provides shipping information from the [Sky56](http://www.sky56.cn/english/track/index), [Correos Express](https://www.correosexpress.com/web/correosexpress/home), [Adicional](http://www.adicional.pt/) and [Expresso24](http://www.expresso24.pt/index.php?action=pesquisaguias3).

Sky56 supports:
- **PQ** Spain Priority Line (Spain Express)
- **NL** Netherlands Post surface mail
- **LV** Bpost International
- **SY** Malasya Pos

### Install
- `npm install geartrack --save`

### API
```javascript
const geartrack = require('geartrack')

// Get Sky 56 info
// Supports these ids: PQ, NL, LV, SY..
geartrack.sky.getInfo(id, (err, SkyInfo) => {
	if(err) { return  }
    
    console.log(SkyInfo.status) // see SkyInfo entity for more fields
})

// Get correos express info (when the package is in spain)
// ID is the provided from Gearbest PQ4F6P07XXXXXXXX750Z
// Postalcode is 4 digit like 1785 (Portuguese)
geartrack.correos.getInfo(id, postalcode, (err, CorreosInfo) => {
	if(err) { return  }
    
    console.log(CorreosInfo.state) // see CorreosInfo entity for more fields
    console.log(CorreosInfo.lastUpdate) 
})

// Get adicional.pt info (when the package is in portugal)
// This info is only obtained after the correos express info
// ID is the provided from the Correos Express, CorreosInfo.id
// Postalcode is 4 digit like 1785
geartrack.adicional.getInfo(id, postalcode, (err, AdicionalInfo) => {
	if(err) { return  }
    
    console.log(AdicionalInfo.status) // see AdicionalInfo entity for more fields
    console.log(AdicionalInfo.distributor) 
})

// Get expresso24.pt info (when the package is in portugal)
// This info is only obtained after the correos express info
// ID is the provided from the Correos Express, CorreosInfo.product.ref
geartrack.expresso24.getInfo(id, (err, ExpressoInfo) => {
    if(err) { return  }

    console.log(ExpressoInfo.status) // see ExpressoInfo entity for more fields 
})
```

### TODO
- Replace callbacks with Promises
- Better handling of timeouts
- More tests and refactor the code

### Changelog
- 01/01/2017 - Added replaced request with requestretry to retry failed requests 
- 31/12/2016 - Added information about Malasya Pos (SYB..)
- 24/12/2016 - Added information about Expresso24.pt
- 17/12/2016 - Added Bpost International mail support
- 14/12/2016 - Added Netherlands Post surface mail support

### License
MIT
