function subpageIsReadyForNavigation()
{
  var subpageContentSections;
  var subpageIntNavLinks;

  if ($("body").hasClass("subpageBody"))
  {
    subpageContentSections = $(".subpageContentSection");
    subpageIntNavLinks = $(".subpageNavLink");

    scrollToURLHash();

    // When the window scrolls, make sure to set the correct menu item in the nav as selected
    updateSelectedNavItem();
    $(window).on("scroll", function()
    {
      updateSelectedNavItem();
    });

    // Capture clicks of the links in the page-specific nav
    subpageIntNavLinks.off("click");
    subpageIntNavLinks.on("click", function(e)
    {
      e.preventDefault();

      // Scoll to the corresponding section of the page
      scrollToPageElement(this.hash, true);
    });
  }


  function scrollToPageElement(elmntID, showScroll)
  {
    var elmntToScrollTo = $(elmntID + "_hash");
    var targetToScrollTo = elmntToScrollTo.offset().top - getMainElmntTopMargin();

    var scrollSpeed = 600;
    if (!showScroll)
      scrollSpeed = 0;

    $("body,html").animate({"scrollTop":targetToScrollTo}, scrollSpeed);
  }


  function scrollToURLHash()
  {
    var urlHash = window.location.hash;

    if (checkThatObjectNotNullOrUndefined(urlHash))
    {
      if (urlHash.length > 1)
      {
        scrollToPageElement(urlHash, false);
        return;
      }
    }

    window.scroll(0,0);
  }


  function updateSelectedNavItem()
  {
    // Loop over the sections in the subpage
    subpageContentSections.each(function()
    {
      var topOfContentSectionAboveHalfWindow = $(this).offset().top - ($(window).height() + getMainElmntTopMargin())/2 < $(window).scrollTop();
      var bottomOfContentSectionBelowHalfWindow = $(this).offset().top + $(this).height() - ($(window).height() + getMainElmntTopMargin())/2 > $(window).scrollTop();
      if (topOfContentSectionAboveHalfWindow && bottomOfContentSectionBelowHalfWindow)
      {
        $("#" + this.id + "_link").addClass("selectedSubpageNavLink");
        if (!($("body").hasClass("pageTransitioning")))
          window.history.replaceState({path: window.location.pathname, pushCausedByTransition: false}, "", window.location.pathname + "#" + this.id.substring(0, this.id.indexOf("_hash")));
      }
      else
      {
        $("#" + this.id + "_link").removeClass("selectedSubpageNavLink");
      }
    });
  }


  function getMainElmntTopMargin()
  {
    return $("main").outerHeight(true) - $("main").outerHeight();
  }
}
