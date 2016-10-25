function checkThatObjectNotNullOrUndefined(objToCheck)
{
  if (objToCheck === undefined || objToCheck === null)
    return false;

  return true;
}

function hasClass(elmt, cls)
{
  return (' ' + elmt.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function getFirstElementWithTagName(tagName, searchTarget)
{
  // Check that all inputs are defined
  if (!(checkThatObjectNotNullOrUndefined(tagName) &&
        checkThatObjectNotNullOrUndefined(searchTarget)))
    return null;

  // Check that we can search for tags in the given search target
  if (!(typeof searchTarget.getElementsByTagName == "function"))
    return null;

  // Get all elements with the given tag name
  var allElementsWithTagName = searchTarget.getElementsByTagName(tagName);

  // Return the first element with that tag name
  return getFirstElementFromHTMLCollectionOrNodeList(allElementsWithTagName);
}

function getFirstElementWithClassName(className, searchTarget)
{
  // Check that all inputs are defined
  if (!(checkThatObjectNotNullOrUndefined(className) &&
        checkThatObjectNotNullOrUndefined(searchTarget)))
    return null;

  // Check that we can query the given search target
  if (!(typeof searchTarget.querySelectorAll == "function"))
    return null;

  // Get all elements with the given class name
  var allElementsWithClassName = searchTarget.querySelectorAll("." + className);

  // Return the first element with that class name
  return getFirstElementFromHTMLCollectionOrNodeList(allElementsWithClassName);
}

function getFirstElementFromHTMLCollectionOrNodeList(collectionToExtractElementFrom)
{
  // Check that the HTMLCollection/NodeList object is defined
  if (!(checkThatObjectNotNullOrUndefined(collectionToExtractElementFrom)))
    return null;

  // Check that it's actually an HTMLCollection or NodeList
  if (!(Object.prototype.toString.call(collectionToExtractElementFrom) === "[object HTMLCollection]" ||
        Object.prototype.toString.call(collectionToExtractElementFrom) === "[object NodeList]"))
    return null;

  // Check that the collection isn't empty
  if (!(collectionToExtractElementFrom.length > 0))
    return null;

  // Return the first element in the collection
  return collectionToExtractElementFrom[0];
}
