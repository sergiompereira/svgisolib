(function(){
	
	
	/**
	 * Dependency
	 */
	if (typeof smp.graphics.Svg === "undefined"){
		throw Error("smp.graphics.Svg is required");
	}
	
	
	SvgIsoLib = (function(){
		
		//constants
		var Y_CORRECT = Math.cos(Math.PI/6)*Math.SQRT2;
		//console.log(Y_CORRECT);
		
		//vars
		var svgcanvas,stage,cellSize,objectsList = [];
		
		//objects
		var Point3D =(function(){

			var constructor = function(x,y,z){
				this.x = x  || 0;
				this.y = y  || 0;
				this.z = z  || 0;
				
				this.add = function(point3d){
					this.x += point3d.x;
					this.y += point3d.y;
					this.z += point3d.z;
					return this;
				}
				this.copy = function(point3d){
					this.x = point3d.x;
					this.y = point3d.y;
					this.z = point3d.z;
					return this;
				}
				this.subtract = function(point3d){
					this.x -= point3d.x;
					this.y -= point3d.y;
					this.z -= point3d.z;
					return this;
				}
			}
			
			return constructor;
			
		}());
		
		var IsoObject = (function(){

			
			var _subclass = smp.classe.extend({
				init:function(position,display){
					/**
					 * size : the side of the cell it occupies in the isometric world grid
					 * display : Raphael Element
					*/
					var _position,_display = display;
					if(!position){
						_position = new Point3D();
					}else{
						_position = position;
					}
					//offsetScreenPos(_position,_display);
					
					//a Raphael Element
					this.getDisplay = function() {
						return _display;
					}
	
					this.getPosition = function(){
						return _position;
					}
					
					this.setPosition = function(point3d){
						var offset = new Point3D().copy(this.getPosition()).subtract(point3d);
						_position.copy(point3d)
						this.offsetScreenPos(offset,path);
					}
					
					this.offsetPosition = function(point3d){
						_position.add(point3d);
						this.offsetScreenPos(point3d,_display);
					}
					this.getDepth = function(){
						return (_position.x + _position.z)*0.866 - _position.y*0.707;
					}
					
					this.offsetScreenPos = function(point3d,display){
						//default empty
					
					}
					
					this.toBack = function(){
					    if(_display){
					    	_display.parentNode.insertBefore(_display, _display.parentNode.firstChild);
					    }
					}
					
					this.toFront = function(){
						if(_display){
					    	_display.parentNode.appendChild(_display);
					    }
					}
					this.insertBefore = function(element){
					    if(_display){
					    	_display.parentNode.insertBefore(_display, element.getDisplay());
                        }
					}
					this.insertAfter = function(element){
					    if(_display){
					    	_display.parentNode.insertBefore(_display, element.getDisplay().nextSibling);
                        }
					}
				}
			});
			
			return _subclass;
		}());
		
		var IsoPath = (function(){
			
			var _subclass = IsoObject.extend({
				init:function(position){
					//private
					var _position = position,
						points = [],
						path,
						strokeWidth = 1,
						strokeColor = "none",
						fillColor = ""
						;
					
					path = smp.graphics.Svg.create("path");
					svgcanvas.appendChild(path);
					this._super(position,path);
					
					//public interface
					this.stroke = function(width, color){
						strokeWidth = width;
						strokeColor = color;
						return this;
					};
					this.fill = function(color){
						fillColor = color;
						return this;
					};
					this.move = function(point3d){
						var p = _isoToScreen(point3d);
						points.push({action:"M", coord:point3d});
						return this;
					};
					this.line = function(point3d){
						var p = _isoToScreen(point3d);
						points.push({action:"L",coord:point3d});
						return this;
					};
					this.curve = function(){
						
					};
					this.draw = function(){

						var i,len = points.length, strpath = "";
						for(i=0; i<len; i++) {
							var p = _isoToScreen(points[i].coord);
							strpath=strpath+points[i].action+p.x+","+p.y;
						}

						path.setAttribute("d", strpath);
						path.setAttribute("stroke-width", strokeWidth);
						path.setAttribute("stroke", strokeColor);
						if(fillColor !== "undefined" && fillColor != ""){
							path.setAttribute("fill", fillColor);
						}
						return this;
					}
					
					//overrides
					this.offsetScreenPos = function(point3d,display){
						var i,len = points.length, strpath = "";
						for(i=0; i<len; i++) {
							points[i].coord.add(point3d);
							var p = _isoToScreen(points[i].coord);
							strpath=strpath+points[i].action+p.x+","+p.y;
						}
						path.setAttribute("d", strpath);
						
					}
				}
				
				
			});
			
			return _subclass;
			
		}());
			
			
		var IsoTile = IsoPath.extend({
			init:function(units,position,borderColor,fillColor){
				
				var _size = units*cellSize-0.2;
				position.add(new Point3D(0.1,0,0.1));
				//this._super(new Point3D().copy(position).add(new Point3D(_size*0.5,0,_size*0.5)));
				this._super(new Point3D().copy(position));
				
				this.move(new Point3D().add(position)).line(new Point3D(_size).add(position)).line(new Point3D(_size,0,_size).add(position)).line(new Point3D(0,0,_size).add(position)).line(new Point3D().add(position));
				this.stroke(1,borderColor);
				this.fill(fillColor);
				this.draw();
				
				
				
				//public interface
				this.getSize = function(){
					return _size;
				}
				this.getRect = function(){
					//return {x:_position.x - _size/2, y:_position.z - _size/2, width:_size, height:_size};
				}
			}
		});
		
		var IsoBlock =(function(){
			
			var _subclass = IsoObject.extend({
				init:function(sideUnits,heightUnits,position,color){
					
					var _size = sideUnits*cellSize-0.2;
					var _h = (heightUnits*cellSize-0.2) ;
					position.add(new Point3D(0.1,0.1,0.1));
					//this._super(new Point3D().copy(position).add(new Point3D(_size*0.5, _h/Y_CORRECT*0.5, _size*0.5)), null);
					this._super(new Point3D().copy(position), null);
					
					
					var ncolor = parseInt(color.substr(1),16);
					var red = ncolor >> 16;
					var green = ncolor >> 8 & 0xff;
					var blue = ncolor & 0xff;
					var leftShadow = (red * 0.75) << 16 | (green * 0.75) << 8 | (blue * 0.75);
					var rightShadow = (red * 0.5) << 16 | (green * 0.5) << 8 | (blue * 0.5);
					leftShadow = leftShadow.toString(16);
					rightShadow = rightShadow.toString(16);
				    while (leftShadow.length < 6) leftShadow = "0" + leftShadow;
				    while (rightShadow.length < 6) rightShadow = "0" + rightShadow;
				    leftShadow = "#"+leftShadow;
					rightShadow = "#"+rightShadow;
					
					
					var top = new IsoPath(position);
					var right = new IsoPath(position);
					var left = new IsoPath(position);
					
					top.move(new Point3D(0,_h,0).add(position)).line(new Point3D(_size,_h,0).add(position)).line(new Point3D(_size,_h,_size).add(position)).line(new Point3D(0,_h,_size).add(position)).line(new Point3D(0,_h,0).add(position));
					top.fill(color);
					top.draw();
					
					right.move(new Point3D(0,0,0).add(position)).line(new Point3D(_size,0,0).add(position)).line(new Point3D(_size,_h,0).add(position)).line(new Point3D(0,_h,0).add(position)).line(new Point3D(0,_h,0).add(position));
					right.fill(rightShadow);
					right.draw();
					
					left.move(new Point3D(0,0,0).add(position)).line(new Point3D(0,_h,0).add(position)).line(new Point3D(0,_h,_size).add(position)).line(new Point3D(0,0,_size).add(position)).line(new Point3D(0,0,0).add(position));
					left.fill(leftShadow);
					left.draw();
					
					var _group = new IsoGroup();
					_group.addChild(top);
					_group.addChild(right);
					_group.addChild(left);
					_group.offsetPosition(new Point3D(0.1,0.1,0.1));
					
					
					//public interface
					this.toBack = function(){
					    top.toBack();
					    right.toBack();
					    left.toBack();
					}
					this.toFront = function(){
					    top.toFront();
					    right.toFront();
					    left.toFront();
					}
					this.insertBefore = function(element){
						
						if(element.getDisplay().length === undefined){
							top.insertBefore(element);
							right.insertBefore(element);
							left.insertBefore(element);
						}else{
							var i, elementColl = element.getDisplay(), len = elementColl.length;
							for(i=0; i<len; i++){
								top.insertBefore(elementColl[i]);
								right.insertBefore(elementColl[i]);
								left.insertBefore(elementColl[i]);
							}
						}
					    
					}
					this.insertAfter = function(element){
						
						if(element.getDisplay().length === undefined){
							top.insertAfter(element);
							right.insertAfter(element);
							left.insertAfter(element);
						}else{
							var i, elementColl = element.getDisplay(), len = elementColl.length;
							for(i=0; i<len; i++){
								top.insertAfter(elementColl[i]);
								right.insertAfter(elementColl[i]);
								left.insertAfter(elementColl[i]);
							}
						}
					    
					}
					
					this.getDisplay = function(){
						return [top,right,left];
					}
					
				}
			});
			
			return _subclass;
		}());
		
		
		/**
		    A handy object to move sets of objects around, but not a "real" object in the world
		    It is not included in the objects list!
		*/
		var IsoGroup = (function(){

			var _subclass = IsoObject.extend({
				init:function(){
					var children = [];
					
					this._super(new Point3D(),null);
					
					
					this.addChild = function(isoObj){			
						children.push(isoObj);
						isoObj.offsetPosition(this.getPosition()); 
					};
					this.getChild = function(id){
						return children[id];
					}
					this.getNumChildren = function(){
						return children.length;
					}
					
					//overrides
					this.setPosition = function(point3d){
						
						var offset = new Point3D().copy(this.getPosition()).subtract(point3d);
						
						this.getPosition().copy(point3d);
						
						var i,len=children.length,childdata;
						for(i=0;i<len;i++){
							children[i].offsetPosition(offset);
						}
					}
					this.offsetPosition = function(point3d){
						this.getPosition().add(point3d);
						var i,len=children.length,childdata;
						for(i=0;i<len;i++){
							children[i].offsetPosition(point3d);
						}
					}
					
					//Just returns de depth of the reference point
					//The group might include objects at very diverse positions (and depths)
					this.getDepth = function(){
						return (this.getPosition().x + this.getPosition().z)*0.866 - this.getPosition().y*0.707;
					}
				
				}
			});
			
			return _subclass;
		}());
			
        //internal utils
        function _addObject(isoObj){
            var i,
            	len = objectsList.length,
            	display,
            	inserted = false,
            	objDepth = isoObj.getDepth(),
            	objCompDepth,
            	objComp,posComp,pos;
            
            if(len>0){
                for(i=0; i<len; i++){
                	objComp = objectsList[i];
                	objCompDepth = objComp.getDepth();
                	
                   if(objCompDepth > objDepth){
                       if(i>0){
                           isoObj.insertBefore(objectsList[i-1]);
                       }
                       objectsList.splice(i,0,isoObj);
                       inserted = true;
                       break;
                   }
                }
                if(!inserted){
                    objectsList.push(isoObj);
                    isoObj.toBack();
                }
            }else{
                objectsList.push(isoObj);
            }
            
            return isoObj;
        }
      
        function _destroyObject(isoObj){
            var i,j,len = objectsList.length, display,displayLen;
            for(i=0; i<len; i++){
                if(objectsList[i] == isoObj){
                	_remove(objectsList[i]);
                    delete objectsList[i];
                    objectsList.splice(i,1);
                    break;
                }
            }
            
            function _remove(isoObj){
            	var j, display = isoObj.getDisplay();
                if(display.length === undefined){
                	display.remove();
                }else{
                	displayLen = display.length;
                	for(j=0; j<displayLen; j++){
                		_remove(display[j]);
                	}
                }
            }
        }
		
		//static public utils
		function _createStage(w,h,size){
			svgcanvas = smp.graphics.Svg.createSVG(w,h);
			stage = {w:w,h:h};
			cellSize = size;
			return svgcanvas;
		}
		function _getPoint3D(x,y,z){
			return new Point3D(x,y,z);
		}
		function _createIsoObject(size,position,display){
			return _addObject(new IsoObject(size,position,display));
		}
		function _createIsoTile(size,position,borderColor,fillColor){
			return _addObject(new IsoTile(size,position,borderColor,fillColor));
		}
		function _createIsoBlock(size,height,position,fillColor){
			return _addObject(new IsoBlock(size,height,position,fillColor));
			
		}
		function _createIsoGroup(){
			return new IsoGroup();
		}
		function _isoToScreen(point3d){
			
			return {
				x:stage.w/2+(point3d.x - point3d.z),
				y:stage.h - point3d.y * Y_CORRECT - (point3d.x + point3d.z) * 0.5
			};
		}
		function _screenToIso(point){
			//return new Point3D(point.y + point.x*0.5 ,0 ,point.y - point.x*0.5);
			//supondo ser um ponto no plano xOz (y=0)
			return new Point3D(stage.h - point.y - stage.w*0.25 + point.x*0.5, 0, stage.h + stage.w*0.25 - point.x*0.5 - point.y)
		}
		function _getUnitSize(){
		    return cellSize;
		}
		
		//expose interface
		return {
			createStage:_createStage,
			point3D:_getPoint3D,
			isoObject:_createIsoObject,
			isoTile:_createIsoTile,
			isoBlock:_createIsoBlock,
			isoGroup:_createIsoGroup,
			isoToScreen:_isoToScreen,
			screenToIso:_screenToIso,
			getUnitSize:_getUnitSize
		}
		
	}());
	
}());