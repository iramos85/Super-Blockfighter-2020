# Super Block Fighter 2020!!!



# Instructions
You are playing as Ken, a retired "block" fighter on a mission to avenge his murdered partner.

# Player One Controls
Using UP and DOWN arrow keys to move your paddle across the board to defend against the enemy projectile. You'll have to contend with your enemy sending the projectile back in an attempt to sneak past your defenses.
Beware! 5 hits and you're dead.

# Player Two Controls
On your mission to avenge your fallen partner, you encounter a body double. Use the "W" and "S" keys to defend yourself against this imposter!
Beware! The imposter has the same health as you - 5 hits to win the game.


# About this game's premise:

This game could suspiciously remind some of a game that was released in 1990 for the Nintendo Entertainment System.  I may have even owned this game as a lad, I may have even played this game and randomly thought about it 30 years later. 

Sure. That is possible.

The game is set around a failed spin-off of Capcom's Street Fighter universe. I suppose they assumed after one game, who is going to keep going? Right. 

My version is a **slight** flight from the original design of the game, a pixelated beauty of a platformer with a bizarre storyline to boot.  I enjoyed the music and I also enjoyed putting my first game around this interesting memory from my childhood.

# Game Mechanics

So the base of this game is centered around pong. *loosely* based off this game. As I came to find out, pong is essentially an exercise is collision and velocity. 

## First, the collision logic. 
  This game utilizes a Axis Aligned Bounding Box vs. Axis Aligned Bounding Box. What does that mean? What we're doing is (in this case, I used canvas) creating an object, first a thin rectangle (symbolizing the "paddle"). Rectangles in canvas are created from the starting point of X axis: 0 and Y axis: 0. 
  
 From there, you state a distance that will symbolize your Y axis value. 
 
 
 Then an X axis variable.
 
 Now your two sides exist on the X and Y axis. From here you'll have to add a "height" to the rectangle and then a width.
 
  <img src="https://i.imgur.com/WbRedVM.jpg" width="500" height="500">  Now our object exists on the X and Y planes.  
 
 Then we'll populate the game ball, a circle, using canvas. The point that the circle will default to is the center of the circle. Which, when the collision logic is fully formed, will insist on colliding with other objects on the plane using it's center. Think of it as using your face to break your fall. Its rough, dont do it. We'll need to declare a length FROM the center to declare as it's edge. 
 
 ball.y (origin point) - ball.radius (distance from center of ball to edge)
 <img src="https://i.imgur.com/xTCzILb.jpg" width="500" height="500"> 
 
 This gives us the sweet outer edge we're looking to collide with our realistic paddle.
 
 This is where **GAME LOGIC** comes into play. We need to state why does what do why. Capiche?
 
 We'll declare each side of our objects. Speak them into existence, so to speak.
 
 
 `    //declaring ball sides
    b.top = b.y - b.radius;  //Ball top is equal to Ball's location on the Y axis (center) minus it's radius
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius; `
    
    
 Then we'll muse (in code) how would these two work together? For instance: If I am standing on the sidewalk, I am NOT in my car (Ian.position < Car.position). If Ian.position is GREATER than Car.position. Then I have somehow merged with the car and at the very least we can refer to this as a "collision". 
 
 Moving on. We apply this logic to each of the sides of our paddle to the edge of our ball. If any of these statements are true: we have collision.
 
 `  return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom `
 
This logic is what we will be "calling back to" to check to see what is going on in our game. We use this as a map to apply further functions of the game to keep it moving.

## Collision and speed had a baby. They named it Velocity.
The following is my first foray into (what i later learned was trigonometry) - I want to be upfront and say Im not a math guy. So this is how I came to understand (and became a man)

<img src="https://imgur.com/a/kijpkYl" width="500" height="700">

So first we need to explain to the computer how to determine who struck first (ha!)

so we'll declare a local variable, with an argument that says if the ball is traveling along the X axis from a determined middle point (half of the canvas width). Remember how we said the rectangle is drawn from 0,0 and OUT? So if the ball is traveling TOWARDS the center point.....its going to.....the left! By default I named this side Player One. So our logic is:
If ball position on the x axis is less than half of the width of the canvas, then it was traveling FROM the right side. If not, then its the computer, right? Aaaalright.

    `
    //determines who is "player", if statement is true, then playerOne, if false = player two
    let players = (ball.x + ball.radius < canvas.width/2) ? playerOne : playerTwo
    `
    
So now we have stored the understanding of where we the ball is traveling from. Now to use maths to discover where it's going and how fast it'll go!


Our IF statement. Here we pose: should our IF statement be true (ball and player have had a collision) - 
we have now must determine WHERE the ball has hit on our object. We'll determine this using the equation:

collision point is equal to, where the ball is on the Y axis, minus where our object is on the Y axis minus half of it's total width. 

 `//ball hits the middle of paddle, at a 0 angle
    let collisionPoint = (ball.y - (player.y + player.height/2));`
 
next we'll use this point to calculate the speed given where the ball has collided with our paddle

 `
  //equation for calculating the ball speed depending on where it hits the paddle
        let angleRad = collisionPoint * (Math.PI/4); 
 `
 
 then we will discern the direction that the ball will travel along the x axis
 
 `
         //x direction of ball when it's hit - by player (traveling to the right, a positive), otherwise computer
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1
`

Now our equations that will calculate the speed of the ball depending on whether it is traveling -45 degree angle OR 45 degrees. Think of it like this, -45 would mean our ball has collided with the object and is now traveling 45 degrees upwards (top left, top right) and then the inverse is true if it hits below. Math.sin and Math.cos are stored functions to determine different sides of the triangle we are calculating for.

`
        // calculates the ball colliding with object and traveling at a -45 degree angle (top of paddle)
        ball.velocityX = direction * ball.speed * Math.cos(angleRad)

        //calculates the ball colliding with object and traveling in a 45 degree angle(bottom of paddle)
        ball.velocityY = ball.speed * Math.sin(angleRad)
`

<img src="https://i.imgur.com/V1gVP8G.jpg" width="500" height="500"> 


lastly we introduce a little **danger** by adding 0.15 to the ball when it has a collision. An easy way to increase the difficulty of the game as it wears on.

# Working Issues and future Updates

Unfortunately as this was my first foray into the world of collision detection and math beyond calculating a tip, I spent the bulk of my time understanding the aforementioned concepts and how they work with each other. I did not get a chance to incorporate sprites, animation or more CSS tweaks and fun.

![Alt Text](https://media.giphy.com/media/3orif8Epddpd8KSELe/giphy.gif)

##Upcoming
Look for sprites being incorporated into our player paddles, game ball and obstacles!

### Sources
Wonderful Pong intro and Collision detection walkthrough
https://danzaidan.itch.io/pong-learn-programming/devlog/98925/introduction-to-collision-detection-for-games

Credit to General Assembly Tutor/Instructors

And Joe for talking me off the ledge(s)


#Original Wireframe

<img src= "https://imgur.com/a/58267VA" width="500" height="500"> 
