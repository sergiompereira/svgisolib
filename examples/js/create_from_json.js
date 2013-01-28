
(function(){
	
	var iso = SvgIsoLib;
	var unit = 20;
	document.getElementById("canvas-container").appendChild(iso.createStage(800,500,unit));

	var i,j;
	for(i=0; i<20; i++){
		for(j=0; j<20; j++){
			iso.isoTile(1, iso.point3D(i*unit,0,j*unit), "#060", "#0c0");
		}
	}
	
	//data from external file
	
	var len = data.length;
	for(i=0; i<len; i++){
		var item = data[i];
		
		var point3d = iso.point3D(item.x*unit,item.y*unit,item.z*unit);
		iso.isoBlock(item.size,item.height,point3d, color);
	}
	
}())

