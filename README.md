## Parcel Locker System Application Development Documentation

## The project developers

The project is developed by the second-year Information Technology students from Oulu University of Applied Sciences.In the second period of our second year study we got the opportunity to work on a Advance Web Development Project(Parcel Locker System). We tried our best to fullfil all the reqirements of the project. It was fun and at the same time challenging to impliment all the functionality of the project but at the end we have accomplished the project through teamwork.

Introduction of the teammembers:-

- **Ashif Moon**, [GitHub account](https://github.com/AshifkhaMoon)
- **Lufei Wu**, [GitHub account](https://github.com/lufeiwu22)
- **Minyi Zhang**, [GitHub account](https://github.com/minyizhangg)
- **Ziqi Li**, [GitHub account](https://github.com/ZiqiLi28)

Ashif Moon:
Ashif Handles the development of fundamental components for the backend driver app, and refining the UI design of the consumer app.

Lufei Wu:
Lufei Wu takes responsibilities for the frontend development of the consumer App, getting password for the cosumer app and API tests.

Minyi Zhang:
Minyi Zhang is charge in the frontend development of the touch screen App, Authentication for the consumer app and React tests.

Ziqi Li:
Ziqi Li holds the reins in backend development, the dashboard page for both the driver and consumer.

In the development of our team's project, each member has assumed primary responsibilities. Simultaneously, everyone is engaged in tasks such as searching and discussing details taking on distinct functions in apps. We collaborate to aid the main responsible person in problem-solving when necessary. Everyone has been active equally.


## Project Overview

The objective of this project was to develop a parcel locker system application which in total has three apps Consumer App,Driver App, Touch Screen Simulator and also a Parcel Generator Robot. The Project enables users to register, log in, send and receive parcels, and keep track of the status of their parcels in the lockers and after that a driver will pick up the parcel and deliver it to it's destination.The ultimate iteration of the system is intended for deployment on the public internet.We have successfully accomplished the framework of our Advanced Web Application Development course.

Project Video Demonstration

(Link will be presented later)


## Project Description
The project has been developed by following Agile software development method and Kanban framework template in GitHub Projects has been used to implement it. Communication of our team has been constant throughout the project and the project progressed as expected. Our team has been meeting evenly on campus and remotely on Teams. Also, teacher meetings have been held weekly and everybody has been able to attend. Overall, our team has been self-organizing, communicative, and able to deliver well-functioning application based on the project requirements.

## Technologies used in the project
User Interface:
- HTML and CSS
- React 

Front-end framework:
- React.js 

Backend:
- Node.js 
- Express API


Database:
- MongoDB

Deployment:
- Still Under Development

Tools
- UI Design: Figma
- Code Editor: Visual Studio Code
- Database Design: MongoDB Compass
- Version Control: Git and GitHub

## Application Architecture Diagram
![Diagram](https://github.com/Team2-LumIEx-organization/Doc/blob/testplan/Application%20Architecture%20Diagram.jpg?raw=true)


## Interface description

The system offers various functionalities through distinct perspectives, including:

- User Registration and Login: Users can sign up for an account and log in to access the system.
- Parcel Delivery Interface: Users can input and dispatch details for a new parcel.
- Receive Parcel Interface: Users can access information about incoming parcels.
- Parcel Status Tracking: Enables users to monitor the status of parcels within the locker system.
- Locker Interface: Simulates a touchscreen interface for lockers, facilitating user interaction with the locker system.

## Installation and Usage Guide (Local Deployment)
Follow these steps to get started with the app development:

1. Clone the repository which you want to develop:
   
   ```bash
   git clone 
   ```

2. Navigate to the project's directory:
   
   ```bash
   cd Backend /ConsumerAppFrontend /DriverAppFrontend /touchScreenSimulator
   ```

3. Install the dependencies:
   
   ```bash
   npm install
   ```



4. Start the development server:
   
      ```bash
   npm start
   ```

  1 Backend -> ```bash
               npm run create-driver
               npm run create-locations
               npm run dev
                ```
   
  2 ConsumerAppFrontend -> ```bash
                           cd ConsumerAppFrontend
                           npm start
                           ```

  3 DriverAppFrontend -> ```bash
                         cd DriverAppFrontend
                         npm start
                           ```

  4 touchScreenSimulator -> ```bash
                            touchScreenSimulator
                            npm Start
                              ```
  5 Robot               -> ```bash 
                            cd Backend
                            npm run run-robot
                             ```
**************************************

               

 ****  - Note: You might need to modify the .env files to run the Project.The above steps may need to be adjusted depending on the environment. ****
