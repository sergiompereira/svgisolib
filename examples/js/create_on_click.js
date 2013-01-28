
(function(){
	
	var iso = SvgIsoLib;
	var unit = 20;
	var canvas = iso.createStage(800,500,unit);
	var canvasCont = document.getElementById("canvas-container");
	canvasCont.appendChild(canvas);

	var floor = iso.isoGroup();
	floor.setPosition(iso.point3D(0,0,0))
	var i,j,tile;
	for(i=0; i<20; i++){
		for(j=0; j<20; j++){
			tile = iso.isoTile(1, iso.point3D(i*unit,0,j*unit), "#060", "#0c0");
			floor.addChild(tile);
		}
	}
	
	tile = iso.isoTile(2.5, iso.point3D(300,50,50), "#060", "#090");
	floor.addChild(tile);
	
	var block = iso.isoBlock(1,1,iso.point3D(300,1,200), "#ffffff")
	
	
	//gets the left and top position relative to the page of the matching element (if absolutely positioned)
	var canvasOffset = {left:canvasCont.offsetLeft, top:canvasCont.offsetTop};
	
	canvas.addEventListener("mousedown", onCanvasClick);
	
	function onCanvasClick(evt){
		var point3d =  iso.screenToIso({x:Math.floor(evt.pageX-canvasOffset.left),
										y:Math.floor(evt.pageY-canvasOffset.top)});
										
	    point3d.x = Math.floor(point3d.x/unit)*unit;
		point3d.y = Math.floor(point3d.y/unit)*unit;
		point3d.z = Math.floor(point3d.z/unit)*unit;
		//console.log(point3d)
		var color = (Math.random()*0xffffff & 0xffffff).toString(16);
		while (color.length < 6) color = "0" + color;
		var block = iso.isoBlock(1,1,point3d, "#"+(color));
		//console.log(block.getDepth());
	}
}())

