function subpageIsReadyForNavigation()
{
  var subpageContentSections;
  var subpageIntNavLinks;

  $(".subpageNavTitle").on("click", function(e)
  {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    if($(this).css("cursor") === "pointer")
    {
      if($(".subpageNav").hasClass("narrowWidthSubpageNav"))
      {
        $(".subpageNav").removeClass("narrowWidthSubpageNav");
        $(".subpageNavTitleTriangle").html("&#9660;");
      }
      else
      {
        $(".subpageNav").addClass("narrowWidthSubpageNav");
        $(".subpageNavTitleTriangle").html("&#9650;");
      }
    }
  });

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

      var spHeader = $(".subpageBody header");
      if (spHeader.offset().top + spHeader.height() < $(window).scrollTop()) {
            $(".subpageNav").css("position", "fixed");
            $(".subpageNav").css("top", "0");

        } else {
            $(".subpageNav").css("position", "absolute");
            $(".subpageNav").css("top", "");
        }
    });

    // Capture clicks of the links in the page-specific nav
    subpageIntNavLinks.off("click");
    subpageIntNavLinks.on("click", function(e)
    {
      e.preventDefault();

      // Close the internal nav menu which might be open if the screen is narrow
      $(".subpageNavTitle").click();

      // Scoll to the corresponding section of the page
      scrollToPageElement(this.hash, true);
    });
  }


  function scrollToPageElement(elmntID, showScroll)
  {
    var elmntToScrollTo = $(elmntID + "_hash");
    var targetToScrollTo = elmntToScrollTo.offset().top - getMainElmntTopMargin();

    var scrollSpeed = 300;
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
    setTimeout(function()
    {
      // Loop over the sections in the subpage
      subpageContentSections.each(function()
      {
        var correspondingNavItem = $("#" + this.id + "_link");
        var topOfContentSectionAboveHalfWindow = $(this).offset().top - ($(window).height() + getMainElmntTopMargin())/2 < $(window).scrollTop();
        var bottomOfContentSectionBelowHalfWindow = $(this).offset().top + $(this).height() - ($(window).height() + getMainElmntTopMargin())/2 > $(window).scrollTop();
        if (topOfContentSectionAboveHalfWindow && bottomOfContentSectionBelowHalfWindow)
        {
          if (!(correspondingNavItem.hasClass("selectedSubpageNavLink")))
          {
            correspondingNavItem.addClass("selectedSubpageNavLink");
            correspondingNavItem.parent().addClass("selectedSubpageNavListItem");

            // Update the page's URL as well
            if (!($("body").hasClass("pageTransitioning")))
              window.history.replaceState({path: window.location.pathname, pushCausedByTransition: true}, "", window.location.pathname + "#" + this.id.substring(0, this.id.indexOf("_hash")));
          }
        }
        else
        {
          if (correspondingNavItem.hasClass("selectedSubpageNavLink"))
            correspondingNavItem.removeClass("selectedSubpageNavLink");
            correspondingNavItem.parent().removeClass("selectedSubpageNavListItem");
        }
      });
    }, 300);
  }


  function getMainElmntTopMargin()
  {
    return $("main").outerHeight(true) - $("main").outerHeight();
  }
}
