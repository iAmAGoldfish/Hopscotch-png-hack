/*
make sure to:
add preview thing
add option for pixel counter
add option for custom abilities for each seperate color
*/

//rgbtohsv thing
function rgbTohsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


function rgbToHsbString(r,g,b) {
  console.log(r + ' ' + g + ' ' + b);
  const hsb = rgbTohsv (r, g, b);
  return 'HSB(' + hsb.h + ',' + hsb.s + ',' + hsb.v + ')';
}





//Stuff in html into constants
const pixelSizeInput = document.querySelector("#pixelSizeInput");
const movementMethod = document.querySelector('#movementMethod');
const includeClones = document.querySelector('#includeClones');
const cloneNumberP = document.querySelector('#cloneNumberP');
const cloneNumberInput = document.querySelector('#cloneNumberInput');
const hopscotchInput = document.querySelector('#hopscotchInput');
//lower left corner position
const offsetXInput = document.querySelector('#offsetXInput');
const offsetYInput = document.querySelector('#offsetYInput');

const imageInput = document.querySelector('#imageInput');
const createHopscotchButton = document.querySelector('#createHopscotchButton');

const noImage = document.querySelector('#noImage');
const output = document.querySelector('#output');
const loading = document.querySelector('#loading');


//create Hopscotch code replacing a block
function blockList(img, outputMethod) {
let results = []; //final list of blocks. Stringified version with brackets removed is added to output
    createHopscotchButton.style.display = 'none'; //hide the button so it cannot be clicked
    loading.style.display = 'initial'; //show the loading gif because loading gifs are cool and also stops me from thinking that the code isn't working 
    let image = document.createElement('img');
    const fr = new FileReader();
    fr.onload = function() {
      //get the image into a form that can be converted to Hopscotch code. (A canvas)
      image.src = fr.result
      image.onload = function() {
        const imageWidth = image.width;
        const imageHeight = image.height;
        let canvas = document.createElement('canvas');
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        canvas.getContext('2d').drawImage(image, 0, 0, imageWidth, imageHeight);

        //Add Hopscotch code to set trail width
        results.push(setTrailWidth(pixelSizeInput.value));
        //loop through pixels
	let rows = [];
	function addBlock(block) {
		results.push(block);
		return block;
	}
       for (let yCoordinate = 0; yCoordinate < imageHeight; yCoordinate ++) {
	let row = [];
          let x = offsetXInput.value; //set lower left corner correctly.
          let y = ((((imageHeight - yCoordinate) * parseInt(pixelSizeInput.value))) + parseInt(offsetYInput.value)).toString(); //Set row and lower left corner correctly
          row.push(addBlock(setPosition(x,y))); //add Hopscotch code at the start of each new row
          if (movementMethod.value == "forward") {
            row.push(addBlock(setTrailWidth(pixelSizeInput.value)));
          }

          for (let xCoordinate = 0; xCoordinate <= imageWidth - 1; xCoordinate ++) {
            const pixelColor = canvas.getContext('2d').getImageData(xCoordinate, yCoordinate, 1, 1).data; //Get pixel color as an array of [R, G, B, A]
           row.push(addBlock(setTrailColor(rgbToHsbString(pixelColor[0], pixelColor[1], pixelColor[2])))); //Set trail color to pixel color. 
           let pixelCount = 1;
console.log(xCoordinate);
            while (true) {
              const nextColor = canvas.getContext('2d').getImageData(xCoordinate + 1, yCoordinate, 1, 1).data;
              const theSameColor = (pixelColor[0] == nextColor[0] && pixelColor[1] == nextColor[1] && pixelColor[2] == nextColor[2]);
console.log(theSameColor);
              if (theSameColor) {
                pixelCount += 1;
                xCoordinate += 1;
console.log(pixelCount);
                if (xCoordinate > imageWidth - 1) {
                  break;
                }
              } else {
                break;
              }
            }
            const distance = (parseInt(pixelSizeInput.value)*pixelCount).toString();
            if (movementMethod.value == "leaveTrail") { //The code is not inside of a draw a trail block and the project is version 24
              row.push(addBlock(moveWithTrail(distance))); //move with trail. Requires project version 24
            } else { //The code is inside of a draw a trail block.
              row.push(addBlock(moveForward(distance)));
            }
          } //end of each pixel in row
          if (movementMethod.value == "forward") {
            row.push(addBlock(setTrailWidth('0')));
          }
		rows.push(row);
        } // end of each row
         //output the Hopscotch code by stringifying array of blocks and removing brackets (First and last characters)
		outputMethod(results, rows);
         /*const final = JSON.stringify(results).substring(1, JSON.stringify(results).length-1);
         output.value = final;
         output.style.display = 'initial';
         //remove loading
         loading.parentNode.removeChild(loading);*/
       } //end of image onload
    }//end of fr onload
    fr.readAsDataURL(img);//This will cause fr onload to happen
      

}//end of blocklist


function makeAbility(name, id) {
	return {"abilityID":id,"name":name,createdAt:014014014, "blocks":[]};
}


function loopThroughX(img, imageWidth, imageHeight, yCoordinate) {
let results = [];
const canvas = document.createElement('canvas');
canvas.width = img.width;
canvas.height = img.height;
canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
for (let xCoordinate = 0; xCoordinate <= imageWidth - 1; xCoordinate ++) {
            const pixelColor = canvas.getContext('2d').getImageData(xCoordinate, yCoordinate, 1, 1).data; //Get pixel color as an array of [R, G, B, A]
           results.push(setTrailColor(rgbToHsbString(pixelColor[0], pixelColor[1], pixelColor[2]))); //Set trail color to pixel color. 
           let pixelCount = 1;
            while (true) {
              const nextColor = canvas.getContext('2d').getImageData(xCoordinate + 1, yCoordinate, 1, 1).data;
              const theSameColor = (pixelColor[0] == nextColor[0] && pixelColor[1] == nextColor[1] && pixelColor[2] == nextColor[2]);
console.log(theSameColor);
              if (theSameColor) {
                pixelCount += 1;
                xCoordinate += 1;
console.log(pixelCount);
                if (xCoordinate > imageWidth - 1) {
                  break;
                }
              } else {
                break;
              }
            }
            const distance = (parseInt(pixelSizeInput.value)*pixelCount).toString();
            if (movementMethod.value == "leaveTrail") { //The code is not inside of a draw a trail block and the project is version 24
              results.push(moveWithTrail(distance)); //move with trail. Requires project version 24
            } else { //The code is inside of a draw a trail block.
              results.push(moveForward(distance));
            }
          
}
return results;
}


function abilityList(image, imageHeight, outputMethod) {
	
	const pixelArt = makeAbility('pixel art', 'petrichorCustomAbility');
	createHopscotchButton.style.display = 'none';
	pixelArt.blocks.push(checkIfElse({"defaultValue":"","value":"","key":"","datum":{"block_class":"conditionalOperator","type":1000,"description":"=","params":[{"defaultValue":"7","value":'1',"key":"","datum":{"HSTraitTypeKey":2006,"HSTraitIDKey":"","HSTraitObjectParameterTypeKey":8004,"description":"Clone Index"},"type":42},{"defaultValue":"7","value":"1","key":"=","type":42}]},"type":49}
,'petrichorIndex1','petrichorIndex1Else'));
	const abilityList = [];
	abilityList.push(pixelArt);
//problems
	blockList(image, function(results, rows) {
	const listOfBlocks = results;
	for (let i = 1; i <= parseInt(cloneNumberInput.value); i ++) {
		const index = i.toString();
		const ability = makeAbility('',`petrichorIndex${index}`);
		if (i == 1) {
			ability.blocks.push(createAClone(cloneNumberInput.value));
		} else {
			const elseAbilityOfPreviousClone = makeAbility('',`petrichorIndex${index - 1}Else`);
			elseAbilityOfPreviousClone.blocks.push(checkIfElse({"defaultValue":"","value":"","key":"","datum":{"block_class":"conditionalOperator","type":1000,"description":"=","params":[{"defaultValue":"7","value":'1',"key":"","datum":{"HSTraitTypeKey":2006,"HSTraitIDKey":`${index}`,"HSTraitObjectParameterTypeKey":8004,"description":"Clone Index"},"type":42},{"defaultValue":"7","value":index,"key":"==","type":42}]},"type":49}
,ability.abilityID,`petrichorIndex${index}Else`));
			abilityList.push(elseAbilityOfPreviousClone);
		}
		
		const numberOfRowsPerClone = imageHeight / parseInt(cloneNumberInput.value);
		const myFirstRow = numberOfRowsPerClone * (i-1);
		for (let j = myFirstRow; j < myFirstRow + numberOfRowsPerClone; j ++) {
			for (let k = 0; k < rows[j].length; k ++) {
				ability.blocks.push(rows[j][k]);
			}
		}
		abilityList.push(ability);
		
	}
	
	
	
	outputMethod(abilityList);
	});
}


includeClones.addEventListener('change',function() {
	if (includeClones.value == 'ability') {
		cloneNumberP.style.display = 'initial';
	} else {
		cloneNumberP.style.display = 'none';
	}
});


function doDownload(list, type) {
	if (hopscotchInput.files.length > 0) {
		const filename = hopscotchInput.files[0].name;
		
		const fir = new FileReader();
		fir.onload = () => {
const baseProject = JSON.parse(fir.result);
		if (type == 0) {
			const ability = makeAbility('pixel art', 'pix');
			ability.blocks = list;
			baseProject.abilities.push(ability);
		} else {
			for (let i = 0; i < list.length; i ++){
				baseProject.abilities.push(list[i]);
			}
			
		}
		const project = JSON.stringify(baseProject);
		download(filename, project);
console.log('hi');
	}
console.log('hello');
fir.readAsText(hopscotchInput.files[0]);
}

}

createHopscotchButton.addEventListener('click', function() {
  
  if (imageInput.files.length > 0) { //If it has a file.
    if (includeClones.value == 'block') {
	blockList(imageInput.files[0], function(results, rows) {
		const final = JSON.stringify(results).substring(1, JSON.stringify(results).length-1);
         output.value = final;
         output.style.display = 'initial';
         //remove loading
         loading.parentNode.removeChild(loading);
	doDownload(results, 0);
	});
    } else {
	const fr = new FileReader();
	fr.onload = function() {
		const img = document.createElement('img');
		img.src = fr.result;
		img.onload = function() {
			const height = img.height;
			if (parseInt(cloneNumberInput.value) > height || parseInt(cloneNumberInput.value) < 1) {
				cloneNumberInput.value = (height).toString();
			}
			abilityList(imageInput.files[0],img.height, function(results) {
		const final = JSON.stringify(results).substring(1, JSON.stringify(results).length-1);
         output.value = final;
         output.style.display = 'initial';
				
         //remove loading
         loading.parentNode.removeChild(loading);
	doDownload(results, 1);
	});
		}
	}
	fr.readAsDataURL(imageInput.files[0]);
	
    }
  } else { //what to do when the create button is clicked without an image being added
    noImage.style.display = 'initial'; //display a message saying that there is no image
  }
});
