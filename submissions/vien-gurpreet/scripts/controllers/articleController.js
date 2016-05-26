(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // COMMENT DONE: What does this method do?  What is it's execution path?

  // This method takes a context object and a callback function next
  // It declares articleData as a function, but does not immediately fire it
  //  articleData function loads into the ctx object the varible article, then fire the next callback function that renders the page

  // After articleData is declared, we call function findWhere on the Article object

  // Article.findWhere would look at the id field of the route to obtain the variable id, which is then used to query a database to find a data row corresponding to a data set of one particular article. The callback function of findWhere is articleData. This means that articleData is called with the result of the webDB.execute SQL call as the parameter.

  // articleData then assign the data row resulting from SQL call into ctx.articles.

  // articleData then invoke the callback function next() which in our case is articlesController.index, passing into it the context that we define in the previous steps.

  // articlesController.index is practically a call to articleView.index with the ctx.articles as the parameter.

  // articleView.index would then render the context's articles, hide every tab other than articles, then populate the filters

  // callstack:
  //  articlesController.loadById < Article.findWhere < webDB.execute < articleData < articleController.index < articleView.index < articleView.populateFilters

  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT DONE: What does this method do?  What is it's execution path?

  // This method is very much the same as the method articlesController.loadById method. But instead of looking for the ID field in the database, this function looks for the author field in the database, then returning a collection of articles (rows) corresponding to that particular author. We then load the page with virtually the same call stack as loadById.
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // COMMENT DONE: What does this method do?  What is it's execution path?

  // Again, this method is similar to loadById in that it queries the database for corresponding articles with the specified categories. It uses the same callstack as loadById to obtain article data then render it to the page

  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT DONE: What does this method do?  What is it's execution path?

  // This method loads all articles into the context object which is referred to when rendering the page

  // 1. articleData is declared as a function but it does not get invoked
  // 2. we check the Article.all array to see if any data exists in it.
  //  2a. if there are data, we load that data set into the context object as the articles field.
  //  2b. if there is no data, we call Article.fetchAll, passing in articleData as the callback function
  //      Article.Fetchall uses webDB execute to query all rows in the database then load their information into the Article.all array. If the database is empty, then Article.fetchALl would use an ajax call to get data from a remote database, then with that information, we can populate our database, then load that information into Article.all array.
  // After loading the information, we use that information to render the page with the callback function articleData
  // articleData then assign the data row resulting from SQL call into ctx.articles.
  // articleData then invoke the callback function next() which in our case is articlesController.index, passing into it the context that we define in the previous steps.
  // articlesController.index is practically a call to articleView.index with the ctx.articles as the parameter.
  // articleView.index would then render the context's articles, hide every tab other than articles, then populate the filters

  // callstack:
  //   articlesController.loadAll < Article.fetchAll < webDB.execute < $.getJSON < articleData < articleController.index < articleView.index < articleView.populateFilters
  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };

  module.articlesController = articlesController;
})(window);
