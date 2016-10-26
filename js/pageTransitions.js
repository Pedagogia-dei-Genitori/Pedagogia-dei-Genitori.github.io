function pageIsReadyForTransitions()
{
  $.ajaxSetup({
    async: true
  });

  history.replaceState({pushCausedByTransition: true}, "", "");

  var pageIsCurrentlyTransitioning = false; // Indicates whether we're currently loading another page or not
  var pageTransitionHasBeenTriggered = false; // Used to prevent confusing the popstate event emitted by Safari on page load with a back/forward
  var pathnameOfLastPageLoaded = "";

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

        if (pathnameOfPageToGoTo != window.location.pathname)
        {
          // Go to the page (unless we are already transitioning to another page)
          if (!pageIsCurrentlyTransitioning)
            transitionToOtherPage(pathnameOfPageToGoTo, true);

          // We've started our first transition (so we need to handle back/forward from now on as well - see handling function below)
          pageTransitionHasBeenTriggered = true;
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
          if (location.pathname != pathnameOfLastPageLoaded)
          {
            transitionToOtherPage(location.pathname, false);
          }
        }
      }
    }
    pageTransitionHasBeenTriggered = true;
  });

  function transitionToOtherPage(pathnameOfPageToGoTo, addPageToHistory)
  {
    pageIsCurrentlyTransitioning = true;

    // Animate the page to disappear and show the progress bar
    $("body").addClass("pageTransitioning");

    // Wait until the progress bar has appeared and then start loading the page's content
    $(".pageTransitionLoadingBar").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function()
    {
      $(".pageTransitionLoadingBar").off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");
      pathnameOfLastPageLoaded = pathnameOfPageToGoTo;
      loadNewPageContent(pathnameOfPageToGoTo, addPageToHistory);
    });
  }


  function loadNewPageContent(pathnameOfPageToLoad, addPageToHistory)
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
        }
        else
        {
          $("body").removeClass(); // Remove all classes
          $("body").addClass("subpageBody");
          $("body").addClass("subpageAnimated");
        }

        // Wait until for the first animation on the progress bar to finish
        $(".pageTransitionLoadingBar").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function()
        {
          $(".pageTransitionLoadingBar").off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");

          // Were now free to transition to another page
          pageIsCurrentlyTransitioning = false;
        });
      }, 2000);

      // Add the page we've loaded to the window's history
      if (addPageToHistory)
      {
        if ((pathnameOfPageToLoad != window.location.href) && (pathnameOfPageToLoad != window.location.pathname))
        {
          window.history.pushState({path: pathnameOfPageToLoad, pushCausedByTransition: true}, "", pathnameOfPageToLoad);
        }
      }
    });
  }
}
