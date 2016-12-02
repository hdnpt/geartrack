# Geartrack

>Track shippments from Gearbest with the Spain Priority Line method.


### Parcel Flow
Your parcel should come from Hong Kong (multiple countries envolved here) -> Spain -> Portugal, with this app you can track exactly where your parcel is.

This litle script provides shipping information from the [Sky56](http://www.sky56.cn/english/track/index), [Correos Express](https://www.correosexpress.com/web/correosexpress/home)  and [Adicional](http://www.adicional.pt/).

When comming from HK:
- Shipping info from sky 56 is displayed

When your parcel is already in spain:
- Shipping info from Correos Express is displayed

When your parcel is in Portugal:
- Shipping info from Adicional.pt is displayed

### As a npm package
- `npm install geartrack --save`

### API
```javascript
const geartrack = require('geartrack')

// Get Sky 56 info (From hong kong)
geartrack.sky.getInfo(id, (err, SkyInfo) => {
	if(err) { return  }
    
    console.log(SkyInfo.status) // see SkyInfo entity for more fields
})

// Get correos express info (when the package is in spain)
geartrack.correos.getInfo(id, postalcode, (err, CorreosInfo) => {
	if(err) { return  }
    
    console.log(CorreosInfo.state) // see CorreosInfo entity for more fields
    console.log(CorreosInfo.lastUpdate) 
})

// Get adicional.pt info (when the package is in portugal)
geartrack.adicional.getInfo(id, postalcode, (err, AdicionalInfo) => {
	if(err) { return  }
    
    console.log(AdicionalInfo.status) // see AdicionalInfo entity for more fields
    console.log(AdicionalInfo.distributor) 
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
ARGS should be in the format of: Tracking ID:Postal code (4 digits)
Example:
PQ4F6P0342389000181750V:1750

Multiple (comma separated without space!):
PQ4F6P0342389000181750V:1700,PQ4F6P034223400181750V:2453

Example:
$ node geartrack.js PQ4F6P0342389000181750V:1750
```

### Screen
![GearTrack](screen.png?raw=true "Screenshot Geartrack")

### Trivia
- Info is displayed in multiple languages, english, spanish and portuguese :D

- Website providing this info will be released soon.

### License
MIT