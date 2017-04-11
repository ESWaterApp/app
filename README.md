# app
This is the repository for the ESW Water App, which is called WaterSense. The goal of WaterSense is to augment the old UCI maintenance reports
system with a mobile and web app that enables easy reporting and management of reports by users and UCI staff. <br/>

__If you want to know what we still need to do, go to the "HELP!!!" at the bottom!__
-------------------------------------------------------------

__The Problem:__
=================
![Too old](http://i.imgur.com/hq6YRYC.jpg) <br/>
__The UCI maintenance report system is outdated.__ In the current UCI maintenance system, when someone wants to report a broken utility like a broken water main or sprinkler, they must send
a report either by [email](http://www.fm.uci.edu/) or through [a web form](http://housing.uci.edu/services/Work_Order.html). This system has
some problems:
1. __If you're reporting broken utilities you will be doing it on your phone__. No one wants to wait for their laptop to start
when their room is flooding. However, web forms and email are formats that developed in the desktop era and are awkward for mobile.
2. __Written email reports are only as detailed as users make them, and can lack important info__. Where was the report? What does it look like? From a maintenance
standpoint, there are some details that need to be known even if the reporter puts in minimum effort.
3. __Web Forms require inputting a lot of data over and over again.__ If you already reported once and gave your contact info, why do you need to 
give it again? The less effort a user needs to put in to report, the more likely they will do so. Also, the web forms ask you to use [Internet
Explorer or Safari](http://workorder.housing.uci.edu/_CV_home.html). Nuff said.

So what do __WE__ do about it?

__The Solution:__
=================
![Oh no Lassie, the logo fell down a well!](http://i.imgur.com/LbGReWV.jpg) <br/>
__WaterSense is a mobile and web app that makes reporting easy and fast for users while still providing maintenance 
personnel all the info they need.__

### 1. Overview
Everyone must sign in through their UCI email, and reporters and personnel have separate views of the app. <br/>
Reporters (students and professors) can make reports and view their progress on a map. <br/>
Maintenance personnel can view assigned jobs and their reports on a map and update their job progress to end users. IF it is desired,
personnel may also request additional info from users and chat in real-time.

### 2. Reporting (UI FINISHED)

To report, 
<ul>
<li>1. sign in with your UCI email,</li>
<li>2. mark your location on Google Maps,</li>
<li>3. take a picture,</li>
<li>4. write an optional report, and then</li> 
<li>5. submit.</li> 
</ul>
That's it! 

### 3. Viewing and Updating Statuses (NOT YET STARTED)
Once a report has been submitted to UCI maintenance, reporters can see their reports on a map. When they click on a marker, they'll see:
<ul>
<li>who's been assigned,</li>
<li>his/her progress as comments, and</li>
<li>expected completion time (or just the time of completion if it's finished).</li>
</ul>
Personnel will see the same view for their assigned reports, but be able to update it. 

__HELP!!! What we need to do!__
===============================
![Superdev!](http://i.imgur.com/FSTZF7Z.jpg) <br/>

__1. Frontend Development__ <br/>
--------------------------
![Ionic](http://i.imgur.com/0v9nSli.png) <br/>
### Overview
The frontend UI of the mobile and web apps is built with [Ionic 2](http://ionicframework.com/) which is itself based on 
[Angular 2](https://angular.io/). If you don't know what those words mean, that's fine. Ionic 2 [has extensive documentation](http://ionicframework.com/docs/) and Angular's
[awesome components system](https://www.youtube.com/watch?v=h8surzS7LOo&t=80s) which should be natural for programmers familiar with OOP. If you're in ICS 31 or 32 and don't know what OOP is, 
[smh](https://www.youtube.com/watch?v=NUl8lcbeN2Y).

### High-Level Tasks (Tentative)
<ul>
<li>1. Develop the user view for viewing report statuses.</li>
<li>2. Develop the personnel status view.</li>
<li>3. Create a menu for personnel to see running jobs.</li>
</ul>

__2. Backend Development__<br/>
--------------------------
![Simplified database schema](http://i.imgur.com/vn4XrEC.jpg)<br/>
### Overview
The backend that stores report + status + user data is [Firebase](https://firebase.google.com/). Authentication is done with the Angular-Firebase module
[AngularFire2](https://github.com/angular/angularfire2) and the Ionic Native [Google+ plugin](https://ionicframework.com/docs/native/google-plus/).
We don't have a schema figured out yet, and due to Firebase's emphasis on real-time data and need to put server logic on the client we
may ditch it and go instead go with an AWS webserver + MEAN stack route. <br/>
As you may have figured with all the tech lingo, this is going to be the more advanced part of development.

### High-Level Tasks (Tentative)
<ul>
<li>1. Finalized the stack.</li>
<li>2. Determine the schema for the app: reports + jobs/statuses + users + reporters + employees.</li>
<li>3. Make the DB data integrated with the existing UCI maintenance data format (maybe send an email of the data as its stored in the DB).</li>
</ul>
