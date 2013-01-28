
#SvgIsoLib
JavaScript library to handle isometric rendering in SVG.
Provides basic isometric operations and uses SVG to render tiles and blocks.

## Requires
Included in the package but copied from different repositories:
smp lib >> https://github.com/sergiompereira/smp-js-lib
smp.graphics.SVG >> https://github.com/sergiompereira/js-utils-and-resources


## Usage

``` javascript

	var unit = 20;
	document.getElementById("canvas-container").appendChild(SvgIsoLib.createStage(800,500,unit));

	var floor = SvgIsoLib.isoGroup();
	floor.setPosition(SvgIsoLib.point3D(0,0,0))
	var i,j,tile;
	for(i=0; i<20; i++){
		for(j=0; j<20; j++){
			tile = SvgIsoLib.isoTile(1, SvgIsoLib.point3D(i*unit,0,j*unit), "#060", "#0c0");
			floor.addChild(tile);
		}
	}
	
	var block = SvgIsoLib.isoBlock(1,1,SvgIsoLib.point3D(300,1,200), "#ffffff");
	
```
	


## Examples
Examples provided in the repository

## Author
[Sérgio Pereira] (http://www.sergiompereira.com)

## License
[MIT License](http://www.opensource.org/licenses/mit-license.php)

