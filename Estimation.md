# Project Estimation  
Date: 13/04/2022

Version: 1.0


# Estimation approach
Consider the EZWH  project as described in YOUR requirement document, assume that you are going to develop the project INDEPENDENT of the deadlines of the course
# Estimate by size
### 
|             | Estimate                        |             
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed   | 30 |             
|  A = Estimated average size per class, in LOC       | 300 | 
| S = Estimated size of project, in LOC (= NC * A) | 9000 |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  | 900 person hours |   
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | 27000 euro | 
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) | 6 calendar weeks |                                  

# Estimate by product decomposition
### 
|         component name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
| requirement document  | 50 |
| GUI prototype | 50 |
| design document | 100 |
| code | 900 |
| unit tests | 300 |
| api tests | 200 |
| management documents | 100 |



# Estimate by activity decomposition
### 
|         Activity name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
| Requirement analysis | 60 |
| Design | 40 |
| Coding | 400 |
| Testing | 250 |
| Project management | 50 |
| Install/deploy | unknown |
| Maintenance | unknow |
###
![Gantt chart](Resources/Gantt_chart.png "Gantt chart")
The install/deploy and maintenance phases are not inserted in the estimated effort for the project because they start at the end of the development of the project and last until the project dismissal (as you can see in the Gantt chart), so we cannot estimate their effort.

# Summary

Report here the results of the three estimation approaches. The  estimates may differ. Discuss here the possible reasons for the difference

|             | Estimated effort                        |   Estimated duration |          
| ----------- | ------------------------------- | ---------------|
| estimate by size | 900 | 6 calendar weeks |
| estimate by product decomposition | 1100 | 7 calendar weeks |
| estimate by activity decomposition | 800 | 5 calendar weeks |




