function subpageIsReadyForNavigation()
{
  var subpageContentSections;
  var subpageIntNavLinks;

  var windowIsCurrentlyScrolling = false;
  var previousWindowTopPosition = 0;
  var scrollDelta = 10;

  $(".subpageNavTitle").on("click", function(e)
  {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    if(!($(".subpageNavTitleTriangle").css("display") === "none"))
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
      if (!($(".subpageNavTitleTriangle").css("display") === "none"))
      {
        if ($(window).scrollTop() <= $(".subpageBody header").height())
        {
          showSubpageHeader();
        }
        else
        {
          if (!windowIsCurrentlyScrolling)
          {
            windowIsCurrentlyScrolling = true;
            (!(window.requestAnimationFrame)) ? setTimeout(showOrHideSubpageHeader, 250) : requestAnimationFrame(showOrHideSubpageHeader);
          }
        }
      }

      updateSelectedNavItem();
    });

    // Same thing if the window resizes
    $(window).resize(function()
    {
      updateSelectedNavItem();

      if (!($(".subpageNavTitleTriangle").css("display") === "none"))
      {
        if ($(window).scrollTop() <= $(".subpageBody header").height())
          showSubpageHeader();
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


  function showOrHideSubpageHeader()
  {
    var currentWindowTopPosition = $(window).scrollTop();

    if ((previousWindowTopPosition - currentWindowTopPosition) > scrollDelta)
    {
      //if scrolling up...
      showSubpageHeader();
    }
    else if((currentWindowTopPosition - previousWindowTopPosition) > scrollDelta)
    {
      //if scrolling down...
      showOrHideHeaderBasedOnScrollPosition()
    }

    previousWindowTopPosition = currentWindowTopPosition;
		windowIsCurrentlyScrolling = false;
  }


  function showOrHideHeaderBasedOnScrollPosition()
  {
    if (!($(".subpageNavTitleTriangle").css("display") === "none"))
    {
      if ($(window).scrollTop() > $(".subpageBody header").height())
        hideSubpageHeader();
      else
        showSubpageHeader();
    }
  }


  function hideSubpageHeader()
  {
    $(".subpageBody header").css("-webkit-transform", "translateY(-100%)");
    $(".subpageBody header").css("-moz-transform", "translateY(-100%)");
    $(".subpageBody header").css("-ms-transform", "translateY(-100%)");
    $(".subpageBody header").css("-o-transform", "translateY(-100%)");
    $(".subpageBody header").css("transform", "translateY(-100%)");

    $(".subpageNav").css("-webkit-transform", "translateY(-7em)");
    $(".subpageNav").css("-moz-transform", "translateY(-7em)");
    $(".subpageNav").css("-ms-transform", "translateY(-7em)");
    $(".subpageNav").css("-o-transform", "translateY(-7em)");
    $(".subpageNav").css("transform", "translateY(-7em)");
  }


  function showSubpageHeader()
  {
    $(".subpageBody header").css("-webkit-transform", "");
    $(".subpageBody header").css("-moz-transform", "");
    $(".subpageBody header").css("-ms-transform", "");
    $(".subpageBody header").css("-o-transform", "");
    $(".subpageBody header").css("transform", "");

    $(".subpageNav").css("-webkit-transform", "translateY(0)");
    $(".subpageNav").css("-moz-transform", "translateY(0)");
    $(".subpageNav").css("-ms-transform", "translateY(0)");
    $(".subpageNav").css("-o-transform", "translateY(0)");
    $(".subpageNav").css("transform", "translateY(0)");
  }


  function getMainElmntTopMargin()
  {
    return $("main").outerHeight(true) - $("main").outerHeight();
  }
}
