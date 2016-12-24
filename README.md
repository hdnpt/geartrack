# Geartrack

>Track shippments from Gearbest with the Spain Priority Line method.

>Online version: [https://geartrack.hdn.pt](https://geartrack.hdn.pt)

### Parcel Flow
Your parcel should come from Hong Kong (multiple countries envolved here) -> Spain -> Portugal, with this app you can track exactly where your parcel is.

This litle script provides shipping information from the [Sky56](http://www.sky56.cn/english/track/index), [Correos Express](https://www.correosexpress.com/web/correosexpress/home), [Adicional](http://www.adicional.pt/) and [Expresso24](http://www.expresso24.pt/index.php?action=pesquisaguias3).

When comming from HK:
- Shipping info from sky 56 is displayed

When your parcel is already in spain:
- Shipping info from Correos Express is displayed

When your parcel is in Portugal:
- Shipping info from Adicional.pt is displayed
- Shipping info from Expresso24.pt is also displayed.

### As a npm package
- `npm install geartrack --save`

### API
```javascript
const geartrack = require('geartrack')

// Get Sky 56 info (From hong kong)
// ID is the provided from Gearbest PQ4F6P07XXXXXXXX750Z
// ID can be also from Netherlands Post surface mail NL14812386234607
geartrack.sky.getInfo(id, (err, SkyInfo) => {
	if(err) { return  }
    
    console.log(SkyInfo.status) // see SkyInfo entity for more fields
})

// Get correos express info (when the package is in spain)
// ID is the provided from Gearbest PQ4F6P07XXXXXXXX750Z
// Postalcode is 4 digit like 1785
geartrack.correos.getInfo(id, postalcode, (err, CorreosInfo) => {
	if(err) { return  }
    
    console.log(CorreosInfo.state) // see CorreosInfo entity for more fields
    console.log(CorreosInfo.lastUpdate) 
})

// Get adicional.pt info (when the package is in portugal)
// This info if only obtained after the correos express info
// ID is the provided from the Correos Express, CorreosInfo.id
// Postalcode is 4 digit like 1785
geartrack.adicional.getInfo(id, postalcode, (err, AdicionalInfo) => {
	if(err) { return  }
    
    console.log(AdicionalInfo.status) // see AdicionalInfo entity for more fields
    console.log(AdicionalInfo.distributor) 
})

// Get expresso24.pt info (when the package is in portugal)
// This info if only obtained after the correos express info
// ID is the provided from the Correos Express, CorreosInfo.id
geartrack.expresso.getInfo(id, (err, ExpressoInfo) => {
    	if(err) { return  }

    console.log(ExpressoInfo.status) // see ExpressoInfo entity for more fields 
})


```


# Standalone app

### Requisits:
- Node, npm

### Install:
- Clone this repo to a folder
- npm install
- `$ node geartrack.js ARGS`

### Usage:
```
ARGS should be the tracking id's
Example:
PQ4F6P0342389000181750V

Multiple (comma separated without space!):
PQ4F6P0342389000181750V,NL1481238121223607

Example:
$ node geartrack.js PQ4F6P0342389000181750V
```

### Screen
![GearTrack](screen.png?raw=true "Screenshot Geartrack")

### Trivia
- Info is displayed in multiple languages, english, spanish and portuguese :D

- Website providing this info will be released soon.

### Changelog
- 24/12/2016 - Added information about Expresso24.pt
- 17/12/2016 - Added Bpost International mail support
- 14/12/2016 - Added Netherlands Post surface mail support

### License
MIT
