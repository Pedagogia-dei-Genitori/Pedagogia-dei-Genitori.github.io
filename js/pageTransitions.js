function pageIsReadyForTransitions()
{
  $.ajaxSetup({
    async: true
  });

  history.replaceState({pushCausedByTransition: true}, "", "");

  var pageIsCurrentlyTransitioning = false; // Indicates whether we're currently loading another page or not
  var pageTransitionHasBeenTriggered = false; // Used to prevent confusing the popstate event emitted by Safari on page load with a back/forward
  var pathnameOfLastPageLoaded = "";
  var hashOfLastPageLoaded = "";

  // Handle links that lead to another page
  $("body").on("click", "[data-type='goToOtherPage']", function(e)
  {
    // Do custom stuff only if the browser supports CSS transitions
    if (Modernizr.csstransitions)
    {
      // Check we're trying to load a link in the same domain
      if (this.host == window.location.host)
      {
        // Prevents just loading the page normally
        e.preventDefault();

        // Get the pathname of the page we need to load
        var pathnameOfPageToGoTo = this.pathname;

        // Check that we're not already transitioning to another page
        if (!pageIsCurrentlyTransitioning)
        {
          var hashOfPageToGoTo;
          if (checkThatObjectNotNullOrUndefined(this.hash))
            hashOfPageToGoTo = this.hash;
          else
            hashOfPageToGoTo = "";

          // Either transition to another page or reload this one
          if (pathnameOfPageToGoTo != window.location.pathname)
          {
            transitionToOtherPage(pathnameOfPageToGoTo, hashOfPageToGoTo, true);

            // We've started our first transition (so we need to handle back/forward from now on as well - see handling function below)
            pageTransitionHasBeenTriggered = true;
          }
          else
          {
            window.location.reload(true);
          }
        }
      }
    }
  });

  // Handle popstate events (e.g. back/forward)
  $(window).on("popstate", function(e)
  {
    // If we've not yet transitioned to another page, we should ignore this pop event as there's no back/forward we can handle (Safari emits popstate event on page load)
    if (e.originalEvent.state.pushCausedByTransition)
    {
      // Do custom stuff only if the browser supports CSS transitions
      if (Modernizr.csstransitions)
      {
        if (!pageIsCurrentlyTransitioning)
        {
          var hashToGoTo;
          if (checkThatObjectNotNullOrUndefined(location.hash))
            hashToGoTo = location.hash;
          else
            hashToGoTo = "";

          if (location.pathname != pathnameOfLastPageLoaded)
          {
            transitionToOtherPage(location.pathname, hashToGoTo, false);
          }
          else if (hashToGoTo != hashOfLastPageLoaded)
          {

          }
        }
      }
    }
    pageTransitionHasBeenTriggered = true;
  });

  function transitionToOtherPage(pathnameOfPageToGoTo, hashOfPageToGoTo, addPageToHistory)
  {
    pageIsCurrentlyTransitioning = true;

    // Animate the page to disappear and show the progress bar
    $("body").addClass("pageTransitioning");

    // Wait until the progress bar has appeared and then start loading the page's content
    $(".pageTransitionLoadingBar").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function()
    {
      $(".pageTransitionLoadingBar").off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");
      pathnameOfLastPageLoaded = pathnameOfPageToGoTo;
      hashOfLastPageLoaded = hashOfPageToGoTo;
      loadNewPageContent(pathnameOfPageToGoTo, hashOfPageToGoTo, addPageToHistory);
    });
  }


  function loadNewPageContent(pathnameOfPageToLoad, hashOfPageToLoad, addPageToHistory)
  {
    // Create a new content wrapper for the <main> element by loading it from the page we are transitioning to
    var newMainContentWrapper = $("<div class='mainContentWrapper'></div>");
    newMainContentWrapper.load(pathnameOfPageToLoad + " .mainContentWrapper > *", function(e)
    {
      // Set the html content of the <main> element to be the wrapper we created
      $("main").html(newMainContentWrapper);

      // Make sure the menu gets closed in case it's open
      if ($(".menuBtn").hasClass("is-active"))
        $(".menuBtn").click();

      // Set 2 second timeout, which allows animations to hide old page and show progress bar
      setTimeout(function()
      {
        // This triggers the animation to expand the progress bar and show the new page
        $("body").removeClass("pageTransitioning");

        // Set the correct class on the body to match which type of page we are loading (e.g. homepage or subpage) - used for CSS
        if (pathnameOfPageToLoad == "" || pathnameOfPageToLoad == "/")
        {
          $("body").removeClass(); // Remove all classes
          $("body").addClass("homepageBody");
          $("body").addClass("homepageAnimated");
          animateHomepageRotatingText();
        }
        else
        {
          $("body").removeClass(); // Remove all classes
          $("body").addClass("subpageBody");
          $("body").addClass("subpageAnimated");
        }

        // Add the page we've loaded to the window's history
        if (addPageToHistory)
        {
          if ((pathnameOfPageToLoad != window.location.href) && (pathnameOfPageToLoad != window.location.pathname))
          {
            window.history.pushState({path: pathnameOfPageToLoad, pushCausedByTransition: true}, "", pathnameOfPageToLoad + hashOfPageToLoad);
          }
        }

        // Scroll to the right section of the page
        subpageIsReadyForNavigation();

        // Wait until for the first animation on the progress bar to finish
        $(".pageTransitionLoadingBar").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function()
        {
          $(".pageTransitionLoadingBar").off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");

          // Were now free to transition to another page
          pageIsCurrentlyTransitioning = false;
        });
      }, 2250);
    });
  }
}
