function createHopscotchMethodBlock(description, type, parameters) {
  return {"block_class":"method","description":description,"type":type,"parameters":parameters};
}
function createHopscotchConditionalControlBlock(description, type, controlScripts, parameters) {
	const block = {"block_class":"conditionalControl","description":description,"type":type,"parameters":parameters, "controlScript": {"abilityID":controlScripts.true}};
	if (controlScripts.hasOwnProperty('false')) {
		block.controlFalseScript = {"abilityID":controlScripts.false};
	}
	return block

}
//parameters
function createHopscotchParameter(defaultValue, value, key, type) {
  return {"defaultValue":defaultValue,"value":value,"key":key,"type":type};
}
function defaultHopscotchParameter(key, value) {
  return createHopscotchParameter("",value,key,42);
}
function lineColorHopscotchParameter(key, value) {
  return createHopscotchParameter("",value,key,44);
}
function variableHopscotchParameter(key, value) {
  return createHopscotchParameter("",value,key,47);
}
function conditionalHopscotchParameter(key, value) {
  return createHopscotchParameter("",value,key,49);
}
function objectHopscotchParameter(key, value) {
  return createHopscotchParameter("",value,key,50);
}
function textOnlyHopscotchParameter(key, value) {
  return createHopscotchParameter("",value,key,55);
}
function sceneHopscotchParameter(key, value) {
  return createHopscotchParameter("",value,key,56);
}
function soundHopscotchParameter(key, value) {
  return createHopscotchParameter("",value,key,51);
}
function eventHopscotchParameter(key, value) {
  return createHopscotchParameter("",value,key,52);
}
function setTextHopscotchParameter(key, value) {
  return createHopscotchParameter("",value,key,54);
}

//blocks

//method
function setTrailColor(color) {
  return createHopscotchMethodBlock('Set trail color',32,[lineColorHopscotchParameter('',color)]);
}
function waitTilTimestamp(timestamp) {
  return createHopscotchMethodBlock('Wait til timestamp',19,[defaultHopscotchParameter('Wait til timestamp in milliseconds',timestamp)]);
}
function moveForward(amount) {
  return createHopscotchMethodBlock('Move forward',23,[defaultHopscotchParameter('amount',amount)]);
}
function setTrailWidth(width) {
  return createHopscotchMethodBlock('Set trail width',31,[defaultHopscotchParameter('',width)]);
}
function setPosition(x, y) {
  return createHopscotchMethodBlock('set position',41,[defaultHopscotchParameter('X',x),defaultHopscotchParameter('Y',y)]);
}
function moveWithTrail(amount) {
  return createHopscotchMethodBlock('Move With Trail',46,[defaultHopscotchParameter('amount',amount)]);
}
function createAClone(amount) {
	return createHopscotchMethodBlock('Create a clone',53,[defaultHopscotchParameter('amount',amount)]);
}

//control or conditional control
function checkIfElse(condition, controlScript, controlFalseScript) {
	return createHopscotchConditionalControlBlock('Check if else', 124, {'true': controlScript, 'false': controlFalseScript}, [condition]);
}