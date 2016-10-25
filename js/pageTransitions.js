function pageIsReadyForTransitions()
{
  var pageIsCurrentlyTransitioning = false;

  $("body").on("click", "[data-type='goToOtherPage']", function(e)
  {
    e.preventDefault();
  });
}
