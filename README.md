# About
PlotBot is a discord bot that enables users to plot data points over time on graphs.
It was originally designed to allow visualizations of Animal Crossing Stalk Market prices. PlotBot is designed to be generic so it can be used for tracking any type of delta over time.
This document describes how to interact with PlotBot.

# Usage
To interact with PlotBot, send a message in the format: `@PlotBot Do Some Thing`
In other words, PlotBot commands always begin by sending @PlotBot at the beginnging of your message followed by some command text.
In the above example, the PlotBot command would be 'Do' and the Do command would be sent 2 parameters with a value of 'Some' and 'Thing'. 
The order of the supplied parameters is very important, but commands and most parameter values are case insensitive. For certain commands, some parameters that would usually be specified at the end of the message can be omitted. This is noted by a parameter beign marked as *optional* in the following command descriptions.
 
# Commands

## Init
When called in a channel (by server administrator\*\*) PlotBot will be 'turned on' for that channel and able to listen and respond to commands.
### Usage
`@PlotBot init`

## Add
The typical way for users to add data points to be plotted.
This is the default PlotBot command, so the command text can be ommitted. Users can just send parameters to PlotBot and this is the command that will be inferred. 
### Parameters
1. value (required) a number
2. user (optional - autofilled if missing) an associated user
3. \*timestamp (optional - autofilled if missing) a point in time that the value occured
### Usage
`@PlotBot Add 78` or `@PlotBot 78`
`@PlotBot 78 @wumpus`
\*`@PlotBot 78 @wumpus 8/23/2020 PM`

## Plot
When this command is called, PlotBot will respond with a graph of the relevant data points as an image.
### Parameters
1. timespan (optional - uses 'wtd' if missing) how far back to plot the graph. Should either be 'week', 'wtd' (week to date starting last sunday), 'month', or 'mtd'
2. users (optional - uses all users if missing) plot the graph over time for the specified users. You can specify as many users as desired sepearated by spaces.
### Usage
`@PlotBot Plot`
`@PlotBot Plot week @wumpus`
`@PlotBot Plot month @wumpus @user2 @user3`

## Group \*
Call this to configure a group of users. Groups can be used to treat multiple users as a single unit. Group names cannot be reused. Groups can be used in most of the places that users are, but you do not need to prepend the @ symbol for a group. Users cannot belong to multiple groups.
### Parameters
1. Config action (required) - 'create', 'disband', 'add', 'remove', 'show'
2. Name (required) - the group to configure
3. Users (required for 'add', and 'remove'; optional for 'create'; omit for 'show', and 'disband')
### Group Create
Create a new group with a Name. The group name specified here *is* case sensitive, and will be displayed as typed. However, future referneces to this name are not case sensitive. Group names cannot be reused. Any users specified after the Name parameter will be automatically added to the new group, as if `Group Add Name Users` was separately called afterwards.
#### Usage
`@PlotBot Group Create CoolKids`
`@PlotBot Group Create NeatGuys @wumpus @user2`
### Group Add
Adds any specified users to the specified group. Users cannot belong to multiple groups. The name of the group sent to the `Group Add` command needs to already exist.
#### Usage
`@PlotBot Group Add CoolKids @user3 @user4 @user6 @user7`
`@PlotBot Group Add NeatGuys @user5`
### Group Remove
Removes any specified users from the specified group. The name of the group sent to the `Group Remove` command needs to already exist.
#### Usage
`@PlotBot Group Remove NeatGuys @wumpus`
`@PlotBot Group Remove CoolKids @user4 @user6`
### Group Disband
Disbands the existing group by removing all users from the group and freeing up the group's name to be reused in the future.
#### Usage
`@PlotBot Group Disband NeatGuys`
### Group Show
Shows all the users in the specified group.
#### Usage
`@PlotBot Group Show CoolKids`


\* not yet supported
\*\* tbd