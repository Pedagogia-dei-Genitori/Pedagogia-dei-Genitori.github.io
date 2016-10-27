function subpageIsReadyForNavigation()
{
  var subpageContentSections;
  var subpageIntNavLinks;

  if ($("body").hasClass("subpageBody"))
  {
    subpageContentSections = $(".subpageContentSection");
    subpageIntNavLinks = $(".subpageNavLink");

    scrollToURLHash();

    // Capture clicks of the links in the page-specific nav
    subpageIntNavLinks.off("click");
    subpageIntNavLinks.on("click", function(e)
    {
      e.preventDefault();

      // Scoll to the corresponding section of the page
      scrollToPageElement($(this.hash + "_hash"));
    });
  }


  function scrollToPageElement(elmntToScrollTo)
  {
    var targetToScrollTo = elmntToScrollTo.offset().top - getMainElmntTopMargin();

    $("body,html").animate({"scrollTop":targetToScrollTo}, 600);
  }


  function scrollToURLHash()
  {
    var urlHash = window.location.hash;

  }


  function getMainElmntTopMargin()
  {
    return $("main").outerHeight(true) - $("main").outerHeight();
  }
}
