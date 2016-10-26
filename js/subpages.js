function subpageLoadHasBeenCompleted()
{
  if (!hasClass(document.body, "subpageAnimated"))
  {
    if (hasClass(document.body, "subpageLoading"))
    {
      // Fade-in the page's content
      document.body.classList.remove("subpageLoading");

      // Wait a few seconds, then disable all animations on the page
      setTimeout(function()
      {
        document.body.classList.add("subpageAnimated");
      }, 2000);
    }
  }
}
