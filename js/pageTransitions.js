function pageIsReadyForTransitions()
{
  var pageIsCurrentlyTransitioning = false; // Indicates whether we're currently loading another page or not
  var pageTransitionHasBeenTriggered = false; // Used to prevent confusing the popstate event emitted by Safari on page load with a back/forward

  // Handle links that lead to another page
  $("body").on("click", "[data-type='goToOtherPage']", function(e)
  {
    // Prevents just loading the page normally
    e.preventDefault();

    // Get the URL of the page we need to load
    var pageToGoTo = $(this).attr("href");

    // Go to that page (unless we are already transitioning to another page)
    if (!pageIsCurrentlyTransitioning)
      transitionToOtherPage(pageToGoTo, addPageToHistory);

    // We've started our first transition (so we need to handle back/forward from now on as well - see handling function below)
    pageTransitionHasBeenTriggered = true;
  });

  // Handle popstate events (e.g. back/forward)
  $(window).on("popstate", function()
  {
    // If we've not yet transitioned to another page, we should ignore this pop event as there's no back/forward we can handle (Safari emits popstate event on page load)
    if (pageTransitionHasBeenTriggered)
    {

    }
    pageTransitionHasBeenTriggered = true;
  });

  function transitionToOtherPage(pageToGoTo, addPageToHistory)
  {
    pageIsCurrentlyTransitioning = true;
  }
}
