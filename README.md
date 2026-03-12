# Linkedin Job Filter Extension
This is an extension that filters out all the posts that don't contain a job offer. I've developed it because there are too many spam posts on my feed.

## How does it work
When enabled, the application controls all the posts in the feed, checks if they have attributes that indicate that they have a job posting inside, if not it adds a css attribute to not display them.

There is a MutationObserver that checks if the DOM is changed. Every time it gets updated it restarts the program to check the posts.

The filter can be turned on and off through the pop-up.

## Installation
1. Download the repository
2. Go to chrome and enable developer mode
3. Upload the unzipped repository as a non packaged extension
4. Go to LinkedIn and turn on the filter