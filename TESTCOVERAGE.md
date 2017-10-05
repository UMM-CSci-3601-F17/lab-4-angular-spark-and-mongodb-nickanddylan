

## End to End

On the end to end testing, I had to change up some things 
due to what I did differently on the client this time around
from the last lab. First of all, the body filter is
now handled by a server query. I had initially had the category
search by a text field in this lab, from the dropdown in #3.
Though I figured out how to make a drop-down that dynamically
updates the categories in said dropdown as they are added.
So annoyingly, for that end I had to change my tests just
to change them back.

## Client

This was more or less the same as last lab.
I tested the filtering of todos. I actually had to remove
some of the tests I had in the last lab, because
I'm handling the body or 'contains' search with a server
request.
