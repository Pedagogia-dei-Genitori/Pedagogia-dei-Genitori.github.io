window.onpageshow = function(event)
{
  // Reload the page (from cache if possible) in case the "back" button was hit (otherwise menu stays open and causes problems)
  if (event.persisted)
    window.location.reload(false);
}

if (document.addEventListener)
{ // All except IE should go through here
  document.addEventListener("DOMContentLoaded", function()
  {
    document.removeEventListener("DOMContentLoaded", arguments.callee, false);

    // Run our initialisation code
    domContentHasLoaded();
  }, false);
}
else if (document.attachEvent)
{ // If IE event model is used
  document.attachEvent("onreadystatechange", function()
  {
    if (document.readyState == "complete")
    {
      document.detachEvent("onreadystatechange", arguments.callee);

      // Run our initialisation code
      domContentHasLoaded();
    }
  });
}


function domContentHasLoaded()
{
  pageIsReadyForTransitions();

  var documentBodyElmnt = document.body;
  if (!checkThatObjectNotNullOrUndefined(documentBodyElmnt))
    return;

  var documentHeaderElmnt = getFirstElementWithTagName("header", document);
  if (!checkThatObjectNotNullOrUndefined(documentHeaderElmnt))
    return;
  var documentHeaderElmntPosition = window.getComputedStyle(documentHeaderElmnt).position;
  if (!checkThatObjectNotNullOrUndefined(documentHeaderElmntPosition))
    return;

  var documentMainElmnt = getFirstElementWithTagName("main", document);
  if (!checkThatObjectNotNullOrUndefined(documentMainElmnt))
    return;

  var headingImg = getFirstElementWithClassName("headingImage", document);
  if (!checkThatObjectNotNullOrUndefined(headingImg))
    return;

  // First of all, let's get the page's main navigation menu
  var navigationMenus = document.querySelectorAll(".mainNavMenu");
  if (!(navigationMenus.length > 0))
    return;
  var navigationMenu = navigationMenus[0];
  if (!navigationMenu)
    return;

  // Spans to use as background for the page's main navigation menu and main content
  var navBackgroundSpan;
  var cntntBackgroundSpan;

  // To get the spans, we first need to get the divs that they're contained in
  var navBackgrounds = document.querySelectorAll(".mainNavBackground");
  var cntntBackgrounds = document.querySelectorAll(".pageContentBackground");
  if (!(navBackgrounds.length > 0 && cntntBackgrounds.length > 0))
    return;

  // These are the divs containing the spans we're looking for
  var navBackground = navBackgrounds[0];
  var cntntBackground = cntntBackgrounds[0];
  if (!(navBackground && cntntBackground))
    return;

  // Now let's get the spans
  var navBackgroundSpans = navBackground.getElementsByTagName("span");
  var cntntBackgroundSpans = cntntBackground.getElementsByTagName("span");
  if (!(navBackgroundSpans.length > 0 && cntntBackgroundSpans.length > 0))
    return;
  navBackgroundSpan = navBackgroundSpans[0];
  cntntBackgroundSpan = cntntBackgroundSpans[0];
  if (!(navBackgroundSpan && cntntBackgroundSpan))
    return;

  // Now that we have the spans, set Velocity animations on them to use when showing/hiding the menu
  initialiseBackgrounds();

  // Get the "Menu" button
  var menuButtons = document.querySelectorAll(".menuBtn");
  if (!(menuButtons.length > 0))
    return;
  var menuButton = menuButtons[0];
  if (!menuButton)
    return;

  // Re-initialise Velocity animations on window resizes
  window.addEventListener("resize", function()
  {
    initialiseBackgrounds();

    if (menuButton.classList.contains("is-active"))
    {
      documentBodyElmnt.style.background = "#ff3264";
      $(navBackgroundSpan).velocity({translateZ: 0, scaleX: 1, scaleY: 1}, 0);
      $(cntntBackgroundSpan).velocity({translateZ: 0, scaleX: 0, scaleY: 0}, 0);
      //;
    }
  });

  // These variables are used to determine whether or not we can handle a mouse click on the "Menu button" (ignore it if we're still animating)
  var animatingButton = false;
  var animatingBackground = false;

  // Handle clicks of the "Menu" button
  menuButton.addEventListener( "click", function(e)
  {
    // Prevent default click action
    e.preventDefault();

    if ((!animatingButton) && (!animatingBackground))
    {
      if (this.classList.contains("is-active"))
      { // We need to close the main navigation menu
        closeMainNavMenu();
      }
      else
      { // We need to open the main navigation menu
        openMainNavMenu();
      }
    }
  });


  function openMainNavMenu()
  {
    // We're about to run some animations
    animatingButton = true;
    animatingBackground = true;
    menuButton.classList.add("is-animating");

    // Animate the contraction of the "Menu" button's hamburger icon
    menuButton.classList.add("is-active");

    // Expand the navigation menu's background and show the menu
    $(navBackgroundSpan).velocity({translateZ: 0, scaleX: 1, scaleY: 1}, 500, "easeInCubic", function()
    {
      navigationMenu.classList.add("fade-in");
      animatingButton = false;
      animatingBackground = false;
      menuButton.classList.remove("is-animating");

      documentHeaderElmnt.style.position = "fixed";

      // This is needed so that the button to close the menu appears in the correct position
      navBackgroundSpan.style.position = "fixed";

      // Hide the page's main content
      documentMainElmnt.style.display = "none";

      // Hide the PdG logo
      headingImg.style.display = "none";

      // Remove the menu button's background so that the expand/contract effect works
      menuButton.style.background = "none"
    });
  }


  function closeMainNavMenu()
  {
    // We're about to run some animations
    animatingButton = true;
    animatingBackground = true;
    menuButton.classList.add("is-animating");

    // Animate the expansion of the "Menu" button's hamburger icon
    menuButton.classList.remove("is-active");

    // Show the page's main content again
    documentHeaderElmnt.style.position = documentHeaderElmntPosition;
    documentMainElmnt.style.display = "block";

    // Show the PdG logo again
    headingImg.style.display = "inline";

    // In case it was changed (e.g. window resized), set the body's background colour back to white
    documentBodyElmnt.style.background = "#fff"

    // Set the menu button's background back to red
    menuButton.style.background = "ff3264"

    // Expand the page's white background, thus hiding the menu
    $(cntntBackgroundSpan).velocity({translateZ: 0, scaleX: 1, scaleY: 1}, 500, "easeInCubic", function()
    {
      navigationMenu.classList.remove("fade-in");

      // Make the navigation menu's background hidden again by re-setting its position (currently it's just behing the white background)
      $(navBackgroundSpan).velocity({translateZ: 0, scaleX: 0, scaleY: 0}, 0);

      // Now fade out the white background (and add event listners to catch moment when fade-out transition completes)
      var isHiddenClassName = "is-hidden";
      if (!hasClass(cntntBackground, isHiddenClassName))
      {
        cntntBackground.addEventListener("webkitTransitionEnd", cntntBackgroundHasFadedOut);
        cntntBackground.addEventListener("otransitionend", cntntBackgroundHasFadedOut);
        cntntBackground.addEventListener("oTransitionEnd", cntntBackgroundHasFadedOut);
        cntntBackground.addEventListener("msTransitionEnd", cntntBackgroundHasFadedOut);
        cntntBackground.addEventListener("transitionend", cntntBackgroundHasFadedOut);
        cntntBackground.classList.add(isHiddenClassName);

        // If we can't perform a CSS transition, go ahead and proceed to the next step as the event listeners won't come back
        if (hasClass(document.documentElement, "no-csstransitions"))
          cntntBackgroundHasFadedOut();
      }
    });
  }


  function cntntBackgroundHasFadedOut()
  {
    // Stop listening for transition end events
    cntntBackground.removeEventListener("webkitTransitionEnd", cntntBackgroundHasFadedOut);
    cntntBackground.removeEventListener("otransitionend", cntntBackgroundHasFadedOut);
    cntntBackground.removeEventListener("oTransitionEnd", cntntBackgroundHasFadedOut);
    cntntBackground.removeEventListener("msTransitionEnd", cntntBackgroundHasFadedOut);
    cntntBackground.removeEventListener("transitionend", cntntBackgroundHasFadedOut);

    // The white background shown when closing the menu has faded out - let's set it back to its original position for the next animation
    var isHiddenClassName = "is-hidden";
    if (hasClass(cntntBackground, isHiddenClassName))
    {
      $(cntntBackgroundSpan).velocity({translateZ: 0, scaleX: 0, scaleY: 0}, 0, function(){
        cntntBackground.classList.remove(isHiddenClassName);
        animatingButton = false;
        animatingBackground = false;
        menuButton.classList.remove("is-animating");
        navBackgroundSpan.style.position = "absolute";
      });
    }
  }


  function initialiseBackgrounds()
  {
    var windowW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var windowH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var doubleWindowDiagonal = Math.sqrt(Math.pow(windowW, 2) + Math.pow(windowH, 2)) * 2;

    $(navBackgroundSpan).velocity({scaleX: 0, scaleY: 0, translateZ: 0}, 0).velocity({height: doubleWindowDiagonal + 'px', width: doubleWindowDiagonal + 'px', top: -(doubleWindowDiagonal/2) + 'px', left: -(doubleWindowDiagonal/2) + 'px'}, 0);

    $(cntntBackgroundSpan).velocity({scaleX: 0, scaleY: 0, translateZ: 0}, 0).velocity({height: doubleWindowDiagonal + 'px', width: doubleWindowDiagonal + 'px', top: -(doubleWindowDiagonal/2) + 'px', left: -(doubleWindowDiagonal/2) + 'px'}, 0);
  }
}
