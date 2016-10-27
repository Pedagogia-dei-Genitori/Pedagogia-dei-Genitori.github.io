function subpageIsReadyForNavigation()
{
  var subpageContentSections;
  var subpageIntNavLinks;

  if ($("body").hasClass("subpageBody"))
  {
    subpageContentSections = $(".subpageContentSection");
    subpageIntNavLinks = $(".subpageNavLink");

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
    $("body,html").animate({"scrollTop":elmntToScrollTo.offset().top}, 600);
  }
}
