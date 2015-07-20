	            NewsEntry = Backbone.Model.extend({
	                // A collection doesn't neccesarily have to set
	                // a model but it makes the code more clear and
	                // later on you can add extra functionality with ease
	            });
	            NewsCollection = Backbone.Collection.extend({
	                model: NewsEntry, // Set the collection to use the NewsEntry model
	                initialize: function(){
	                    // When initialized we want to associate a view with this collection
	                    this.newslist = new NewsList;
	                    // Backbone lets us "listen" for certain events
	                    // In this case when the collection receives an array
	                    // of models we want to re-render the list view
	                    this.bind("refresh", this.newslist.renderList);
	                },
	            });
	            
	            NewsList = Backbone.View.extend({
	                el: $("#newslist"), // Every view has a element associated with it
	                initialize: function(){
	                    // Set the initial content of the view
	                    this.$el.html("Type to search and go to gym");
	                },
	                renderList: function( collection ){
	                    // This function is called when the collection "listens"
	                    // for the "refresh" event which is called in our loadResults()
	                    console.log(collection)
	                    // Now we want to compile our underscore template
	                    // The underscore template just takes a string of text/html 
	                    var compiled_template = _.template( $("#newslistul").html() );
	                    // Once compiled we can call our template and pass it any 
	                    // matching data we have and append it to our view.el
	                    collection.newslist.el.html( compiled_template( { news: collection.models } ) );
	                }
	            });
	            AppView = Backbone.View.extend({
	                el: $("#appview"),
	                initialize: function(){
	                    // Lets create an empty collection to store the news
	                    this.news_collection = new NewsCollection;
	                },
	                events: {
	                    // Events are attached when Backbone starts and 
	                    // there are many types. We are simply listening for
	                    // "keypress" on the input field #searchbox
	                    "keypress #searchbox": "loadResults"
	                },
	                loadResults: function(event){
	                    // results is passed an event object which we 
	                    // can use to get the input text, also note "this"
	                    // refers to the current view
	                    query = $(event.currentTarget).val();
	                    
	                    // Now we will use jquery deferred objects to get 
	                    // data from the google api
	                    $.when( this.ajaxGetNews( query ) )
	                    .then( $.proxy( function( response ){
	                        // Below is accessing all the news from google api
	                        // It puts it in a big json string and I am 
	                        // simply selecting it
	                        entries = response.feed.entry;
	                        // Now we pass the array of json objects to add to the collection
	                        this.news_collection.refresh( entries );
	                    }, this ) ); // $.proxy is a useful way of passing the parent object to the anonymous function
	                },
	                ajaxGetNews: function( query ){
	                    // Google is damn fast, return the ajax function to pass the promise() test in the $.when statement
	                    return $.ajax("https://www.google.com/base/feeds/snippets/?q=" + query + "&alt=json", { dataType: "json" }); 
	                }
	            
	            });
	            // Create an app view once the document has loaded
	            var appview = new AppView;
