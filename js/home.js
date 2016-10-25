var pageLoadIsCompete = setInterval(function()
{
  if (/loaded|complete/.test(document.readyState))
  {
    clearInterval(pageLoadIsCompete);

    // Show the page's content with the mask animation
    document.body.classList.remove("homepageLoading");

    // Wait a delay and then start animating the page's rotating text
    var maskAnimationWait = 5000;
    animateHomepageRotatingText(maskAnimationWait - 1000);

    // Wait 5 seconds
    setTimeout(function()
    {
      // Make sure the intro mask animations don't repeat after closing the menu
      document.body.classList.add("homepageAnimated");
    }, 5000);
  }
}, 10);


function animateHomepageRotatingText(animationStartDelay)
{
  var changingWords = document.querySelectorAll(".homepageChangingText");

  var arrayOfChangingWords = [];
  for (var i = 0; i < changingWords.length; i++)
  {
    addWordToArray(changingWords[i]);
  }

  var indexOfCurrentlyDisplayedWord = 0;
  setInterval(showNextWord, animationStartDelay);


  function addWordToArray(wordToAdd)
  {
    // Get the word's textual content, and set the element containing the word to empty (we'll will it with a span for each letter)
    var wordHTMLContent = wordToAdd.innerHTML;
    wordToAdd.innerHTML = "";

    // For each letter in this word, create a span, add it as a child of the word, and add it to an array
    var lettersInWord = [];
    for (var letterIndex = 0; letterIndex < wordHTMLContent.length; letterIndex++)
    {
      var letterSpan = document.createElement("span");
      if (arrayOfChangingWords.length < 1)
        letterSpan.className = "homepageChangingLetter";
      else
        letterSpan.className = "homepageChangingLetter out";
      letterSpan.innerHTML = wordHTMLContent.charAt(letterIndex);
      if (letterSpan.innerHTML == " ")
      {
        letterSpan.innerHTML = "&nbsp;";
      }
      wordToAdd.appendChild(letterSpan);
      lettersInWord.push(letterSpan);
    }

    // Add the array of letters to the array of words
    arrayOfChangingWords.push(lettersInWord);
  }


  function showNextWord()
  {
    var currentlyDisplayedWord = arrayOfChangingWords[indexOfCurrentlyDisplayedWord];
    var indexOfNextWordToDisplay = indexOfCurrentlyDisplayedWord == (arrayOfChangingWords.length - 1) ? 0 : indexOfCurrentlyDisplayedWord + 1;
    var nextWordToDisplay = arrayOfChangingWords[indexOfNextWordToDisplay];

    // Rotate away the currently displayed word
    for (letterIndex = 0; letterIndex < currentlyDisplayedWord.length; letterIndex++)
    {
      animateLetterOut(currentlyDisplayedWord[letterIndex], letterIndex);
    }

    for (letterIndex = 0; letterIndex < nextWordToDisplay.length; letterIndex++)
    {
      nextWordToDisplay[letterIndex].className = "homepageChangingLetter behind";
      nextWordToDisplay[0].parentElement.style.opacity = 1;
      nextWordToDisplay[0].parentElement.style.overflow = "visible";
      var enterDelay = 0;
      if (indexOfCurrentlyDisplayedWord == 0)
        enterDelay = 600;
      else if (indexOfCurrentlyDisplayedWord == 1)
        enterDelay = 350;
      animateLetterIn(nextWordToDisplay[letterIndex], letterIndex, enterDelay);
    }

    indexOfCurrentlyDisplayedWord = indexOfNextWordToDisplay;
  }


  function animateLetterIn(letterBeingAnimated, indexOfLetter, enterDelay)
  {
    setTimeout(function(){
      letterBeingAnimated.className = "homepageChangingLetter in";
    }, (enterDelay + (80 * indexOfLetter)));
  }


  function animateLetterOut(letterBeingAnimated, indexOfLetter)
  {
    setTimeout(function(){
      letterBeingAnimated.className = "homepageChangingLetter out";
    }, (80 * indexOfLetter));
  }
}








/*
var words = document.getElementsByClassName('word');
var wordArray = [];
var currentWord = 0;

words[currentWord].style.opacity = 1;
for (var i = 0; i < words.length; i++) {
  splitLetters(words[i]);
}

function changeWord() {
  var cw = wordArray[currentWord];
  var nw = currentWord == words.length-1 ? wordArray[0] : wordArray[currentWord+1];
  for (var i = 0; i < cw.length; i++) {
    animateLetterOut(cw, i);
  }

  for (var i = 0; i < nw.length; i++) {
    nw[i].className = 'letter behind';
    nw[0].parentElement.style.opacity = 1;
    animateLetterIn(nw, i);
  }

  currentWord = (currentWord == wordArray.length-1) ? 0 : currentWord+1;
}

function animateLetterOut(cw, i) {

}

function animateLetterIn(nw, i) {
  setTimeout(function() {
		nw[i].className = 'letter in';
  }, 340+(i*80));
}

function splitLetters(word) {
  var content = word.innerHTML;
  word.innerHTML = '';
  var letters = [];
  for (var i = 0; i < content.length; i++) {
    var letter = document.createElement('span');
    letter.className = 'letter';
    letter.innerHTML = content.charAt(i);
    word.appendChild(letter);
    letters.push(letter);
  }

  wordArray.push(letters);
}

changeWord();
setInterval(changeWord, 4000);*/
