

## End to End
On the end to end side of testing, we mostly checked what todos were returned as a result of the inputted filters. Owner was checked to satisfy that the server would properly return filtered results. Category and Status were checked for each possible choice to verify that our dropdown functionality is intact. Content is also checked. The testing of the client-side filters also ensures that the server is returning all todos when it is asked to do so. We also included a test with multiple parameters to make sure that combinations are possible and are working properly. Finally, we added tests to ensure that the proper filtering user interfaces were being displayed on the screen.

We had to change up some things due to what we did differently on 
the client this time around from the last lab. First of all, 
the body filter is now handled by a server query. We initially had the category
search by a text field in this lab, from the dropdown in #3.
Though we figured out how to make a drop-down that dynamically
updates the categories in said dropdown as they are added.
So (annoyingly), for that end we had to change the tests just
to change them back. 

Another major change was the implementation of adding todos on the client-side.
We were initially hesitant to implement e2e testing for this because technically your tests aren't
supposed to interact with the actual DB. Interestingly, it appears that what happens in e2e tests
has no effect the actual DB, and therefore the actual web page. Adding todos on our page also now
adds a new field to the category dropdown. So this is also tested within the 'add todo' test to make sure
that this "dynamic dropdown" actually works as intended.

## Client
For the client side, we first check to see the the todo object contains the properties that we would expect it to have and can be filtered based on them. We then examine our client-side filtering method to make sure it is working properly by checking each of the two properties it is responsible for filtering. We also check that multiple parameters are working and returning what we would expect. The testing of the client-side filter focuses on testing the length of the returned list of todos, which is something that the E2E testing doesn't really address so we thought it was beneficial that it was covered in this section. Error testing that was transferred from the user-list.spec file was also included in our tests here.

This was more or less the same as last lab.
We tested the filtering of todos. We actually had to remove
some of the tests we had in the last lab, because
we're handling the body or 'contains' search with a server
request.

Specifically, the client-side tests first
