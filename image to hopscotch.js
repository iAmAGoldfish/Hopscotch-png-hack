

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






function rgbStringToHsbString(rgb) {
  const rgbCommaSeperated = rgb.substring(4, rgb.length - 1);
  const array = rgbCommaSeperated.split(',');
  const r = parseInt(array[0]);
  const g = parseInt(array[1]);
  const b = parseInt(array[2]);
  const hsb = rgbTohsv (r, g, b);
  return 'HSB(' + hsb.h + ',' + hsb.s + ',' + hsb.v + ')';
}




const pixelSizeInput = document.querySelector("#pixelSizeInput");
const offsetXInput = document.querySelector('#offsetXInput');
const offsetYInput = document.querySelector('#offsetYInput');
const imageInput = document.querySelector('#imageInput');
const createHopscotchButton = document.querySelector('#createHopscotchButton');
const noImage = document.querySelector('#noImage');
const output = document.querySelector('#output');
const loading = document.querySelector('#loading');
const hopscotchProjectInput = document.querySelector('#hopscotchProjectInput');
const save = document.querySelector('#hopscotchSaveButton');
let finalHopscotchFile;


save.addEventListener('click', function() {

});

createHopscotchButton.addEventListener('click', function() {
  let results = [];
  if (imageInput.files.length > 0) {
    createHopscotchButton.style.display = 'none';
    loading.style.display = 'initial';
    //create blocks
    let image = document.createElement('img');
    let imageWidth, imageHeight;
    const fr = new FileReader();
    fr.onload = function() {
      image.src = fr.result
      image.onload = function() {
        imageWidth = image.width;
        imageHeight = image.height;
        let canvas = document.createElement('canvas');
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        canvas.getContext('2d').drawImage(image, 0, 0, imageWidth, imageHeight);
        results.push(setTrailWidth(pixelSizeInput.value));
       for (let yCoordinate = 0; yCoordinate < imageHeight; yCoordinate ++) {
          let x = offsetXInput.value;
          let y = ((((imageHeight - yCoordinate) * parseInt(pixelSizeInput.value))) + parseInt(offsetYInput.value)).toString();
          results.push(setPosition(x,y));


          for (let xCoordinate = 1; xCoordinate <= imageWidth; xCoordinate ++) {
            const pixelColor = canvas.getContext('2d').getImageData(xCoordinate, yCoordinate, 1, 1).data;
            results.push(setTrailColor(rgbStringToHsbString('RGB(' + pixelColor[0] + ',' + pixelColor[1] + ',' + pixelColor[2] + ')')));
            results.push(moveWithTrail(pixelSizeInput.value));
          }
          
        }
       if (hopscotchProjectInput.files.length == 0) {
         const final = JSON.stringify(results).substring(1, JSON.stringify(results).length-1);
         output.value = final;
         output.style.display = 'initial';
       loading.parentNode.removeChild(loading);
       } else {
         const reader = new FileReader()
         reader.onload = function (event) {
           let hopscotchFile = JSON.parse(event.target.result);
           let object = {};
           object.objectID = "petrichorPixelDrawerObject";
           object.xPosition = '0';
           object.yPosition = '0';
           object.width = '74';
           object.height = '55';
           object.text = '';
           object.filename = 'text-object.png';
           object.type = 1;
           object.name = 'text';
           hopscotchFile.scenes[0].objects.push('petrichorPixelDrawerObject');
           object.rules = ['petrichorPixelDrawerRule'];
           let rule = {};
           rule.name = '';
           rule.abilityID = 'petrichorPixelDrawerAbility';
           rule.id = 'petrichorPixelDrawerRule';
           rule.ruleBlockType = 6000;
           rule.objectID = 'petrichorPixelDrawerObject';
           let parameters = [{"type":52,"defaultValue":"","value":"","key":"Pixel Draw","datum":{"type":7000,"block_class":"operator","description":"Game Starts"}}];
           rule.parameters = parameters;
           hopscotchFile.rules.push(rule);
           let ability = {};
           ability.abilityID = "petrichorPixelDrawerAbility";
           ability.createdAt = 572652376.699452;
           ability.blocks = results;
           hopscotchFile.abilities.push(ability);
           console.log(JSON.stringify(hopscotchFile));
           finalHopscotchfile = hopscotchFile;
           
  const file = new File([finalHopscotchFile], hopscotchProjectInput.files[0].name);
  let uriContent = 'data:application/octet-stream,' + encodeURIComponent(JSON.stringify(hopscotchFile));
  save.href = uriContent;
save.download = file.name;
    save.style.display = 'initial';

                  loading.parentNode.removeChild(loading);
          }
          reader.readAsText(hopscotchProjectInput.files[0]);
         


}

       
      }
    }
    fr.readAsDataURL(imageInput.files[0]);
    image.alt = 'image';
      } else {
    noImage.style.display = 'initial';
  }
});